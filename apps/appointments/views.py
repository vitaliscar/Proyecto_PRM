"""
Appointment views for PRM Backend.
"""

from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.utils import timezone
from datetime import datetime, timedelta
from .models import Appointment, AppointmentHistory, AppointmentReminder
from .serializers import (
    AppointmentSerializer, AppointmentListSerializer, AppointmentCreateSerializer,
    AppointmentCalendarSerializer, AppointmentHistorySerializer, AppointmentReminderSerializer
)
from core.permissions import IsPsychologistOrAdministrator


class AppointmentViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing appointments.
    """
    queryset = Appointment.objects.all()
    permission_classes = [IsPsychologistOrAdministrator]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status', 'appointment_type', 'priority', 'psychologist', 'date']
    search_fields = ['patient__first_name', 'patient__last_name', 'patient__cedula', 'reason']
    ordering_fields = ['date', 'time', 'created_at']
    ordering = ['date', 'time']

    def get_serializer_class(self):
        if self.action == 'list':
            return AppointmentListSerializer
        elif self.action == 'create':
            return AppointmentCreateSerializer
        elif self.action == 'calendar':
            return AppointmentCalendarSerializer
        return AppointmentSerializer

    def get_queryset(self):
        queryset = Appointment.objects.select_related('patient', 'psychologist')
        
        # Filter by psychologist if user is psychologist
        if self.request.user.role == 'psychologist':
            queryset = queryset.filter(psychologist=self.request.user)
        
        # Filter by date range
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        
        if start_date:
            queryset = queryset.filter(date__gte=start_date)
        if end_date:
            queryset = queryset.filter(date__lte=end_date)
        
        return queryset

    @action(detail=False, methods=['get'])
    def calendar(self, request):
        """Get appointments for calendar view."""
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def today(self, request):
        """Get today's appointments."""
        today = timezone.now().date()
        queryset = self.get_queryset().filter(date=today)
        serializer = AppointmentListSerializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def upcoming(self, request):
        """Get upcoming appointments."""
        now = timezone.now()
        queryset = self.get_queryset().filter(
            date__gte=now.date()
        ).exclude(
            date=now.date(),
            time__lt=now.time()
        )[:10]
        
        serializer = AppointmentListSerializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        """Update appointment status."""
        appointment = self.get_object()
        new_status = request.data.get('status')
        
        if new_status not in dict(Appointment.STATUS_CHOICES):
            return Response(
                {'error': 'Estado inválido'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        old_status = appointment.status
        appointment.status = new_status
        appointment.save()
        
        # Create history entry
        AppointmentHistory.objects.create(
            appointment=appointment,
            action='updated',
            description=f'Estado cambiado de {old_status} a {new_status}',
            previous_data={'status': old_status},
            new_data={'status': new_status},
            created_by=request.user
        )
        
        return Response({
            'message': 'Estado actualizado exitosamente',
            'status': appointment.status
        })

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Cancel appointment."""
        appointment = self.get_object()
        
        if not appointment.can_be_cancelled():
            return Response(
                {'error': 'Esta cita no puede ser cancelada'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        reason = request.data.get('reason', '')
        appointment.status = 'cancelled'
        appointment.save()
        
        # Create history entry
        AppointmentHistory.objects.create(
            appointment=appointment,
            action='cancelled',
            description=f'Cita cancelada. Motivo: {reason}',
            created_by=request.user
        )
        
        return Response({
            'message': 'Cita cancelada exitosamente'
        })

    @action(detail=True, methods=['post'])
    def reschedule(self, request, pk=None):
        """Reschedule appointment."""
        appointment = self.get_object()
        
        if not appointment.can_be_rescheduled():
            return Response(
                {'error': 'Esta cita no puede ser reprogramada'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        new_date = request.data.get('date')
        new_time = request.data.get('time')
        
        if not new_date or not new_time:
            return Response(
                {'error': 'Fecha y hora son requeridas'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Store old data
        old_data = {
            'date': str(appointment.date),
            'time': str(appointment.time)
        }
        
        # Update appointment
        appointment.date = new_date
        appointment.time = new_time
        appointment.save()
        
        # Create history entry
        AppointmentHistory.objects.create(
            appointment=appointment,
            action='rescheduled',
            description='Cita reprogramada',
            previous_data=old_data,
            new_data={'date': new_date, 'time': new_time},
            created_by=request.user
        )
        
        return Response({
            'message': 'Cita reprogramada exitosamente',
            'appointment': AppointmentSerializer(appointment).data
        })

    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        """Mark appointment as completed."""
        appointment = self.get_object()
        
        if appointment.status != 'in_progress':
            return Response(
                {'error': 'Solo se pueden completar citas en progreso'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        notes = request.data.get('notes', '')
        private_notes = request.data.get('private_notes', '')
        requires_followup = request.data.get('requires_followup', False)
        followup_date = request.data.get('followup_date')
        
        appointment.status = 'completed'
        if notes:
            appointment.notes = notes
        if private_notes:
            appointment.private_notes = private_notes
        appointment.requires_followup = requires_followup
        if followup_date:
            appointment.followup_date = followup_date
        
        appointment.save()
        
        # Update patient's last appointment
        appointment.patient.last_appointment = timezone.now()
        appointment.patient.save()
        
        # Create history entry
        AppointmentHistory.objects.create(
            appointment=appointment,
            action='completed',
            description='Cita completada',
            created_by=request.user
        )
        
        return Response({
            'message': 'Cita completada exitosamente'
        })

    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Get appointment statistics."""
        queryset = self.get_queryset()
        today = timezone.now().date()
        
        stats = {
            'total': queryset.count(),
            'today': queryset.filter(date=today).count(),
            'upcoming': queryset.filter(date__gt=today).count(),
            'by_status': {
                'scheduled': queryset.filter(status='scheduled').count(),
                'confirmed': queryset.filter(status='confirmed').count(),
                'completed': queryset.filter(status='completed').count(),
                'cancelled': queryset.filter(status='cancelled').count(),
                'no_show': queryset.filter(status='no_show').count(),
            },
            'by_type': {
                'presencial': queryset.filter(appointment_type='presencial').count(),
                'virtual': queryset.filter(appointment_type='virtual').count(),
                'telefonica': queryset.filter(appointment_type='telefonica').count(),
            },
            'this_week': queryset.filter(
                date__range=[
                    today - timedelta(days=today.weekday()),
                    today + timedelta(days=6-today.weekday())
                ]
            ).count(),
            'this_month': queryset.filter(
                date__year=today.year,
                date__month=today.month
            ).count(),
        }
        
        return Response(stats)

    @action(detail=False, methods=['get'])
    def available_slots(self, request):
        """Get available appointment slots."""
        psychologist_id = request.query_params.get('psychologist_id')
        date = request.query_params.get('date')
        
        if not psychologist_id or not date:
            return Response(
                {'error': 'psychologist_id y date son requeridos'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            date_obj = datetime.strptime(date, '%Y-%m-%d').date()
        except ValueError:
            return Response(
                {'error': 'Formato de fecha inválido. Use YYYY-MM-DD'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get existing appointments for the day
        existing_appointments = Appointment.objects.filter(
            psychologist_id=psychologist_id,
            date=date_obj,
            status__in=['scheduled', 'confirmed', 'in_progress']
        ).values_list('time', 'duration')
        
        # Generate available slots (9 AM to 6 PM, 1-hour slots)
        available_slots = []
        start_time = datetime.strptime('09:00', '%H:%M').time()
        end_time = datetime.strptime('18:00', '%H:%M').time()
        
        current_time = datetime.combine(date_obj, start_time)
        end_datetime = datetime.combine(date_obj, end_time)
        
        while current_time < end_datetime:
            slot_time = current_time.time()
            
            # Check if slot is available
            is_available = True
            for apt_time, duration in existing_appointments:
                apt_start = datetime.combine(date_obj, apt_time)
                apt_end = apt_start + timedelta(minutes=duration)
                slot_end = current_time + timedelta(hours=1)
                
                if (current_time < apt_end and slot_end > apt_start):
                    is_available = False
                    break
            
            if is_available:
                available_slots.append(slot_time.strftime('%H:%M'))
            
            current_time += timedelta(hours=1)
        
        return Response({
            'date': date,
            'psychologist_id': psychologist_id,
            'available_slots': available_slots
        })


class AppointmentHistoryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for viewing appointment history.
    """
    queryset = AppointmentHistory.objects.all()
    serializer_class = AppointmentHistorySerializer
    permission_classes = [IsPsychologistOrAdministrator]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['appointment', 'action']
    ordering = ['-created_at']

    def get_queryset(self):
        queryset = AppointmentHistory.objects.select_related('appointment', 'created_by')
        
        # Filter by psychologist if user is psychologist
        if self.request.user.role == 'psychologist':
            queryset = queryset.filter(appointment__psychologist=self.request.user)
        
        return queryset


class AppointmentReminderViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing appointment reminders.
    """
    queryset = AppointmentReminder.objects.all()
    serializer_class = AppointmentReminderSerializer
    permission_classes = [IsPsychologistOrAdministrator]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['appointment', 'reminder_type', 'status']
    ordering = ['scheduled_for']

    def get_queryset(self):
        queryset = AppointmentReminder.objects.select_related('appointment')
        
        # Filter by psychologist if user is psychologist
        if self.request.user.role == 'psychologist':
            queryset = queryset.filter(appointment__psychologist=self.request.user)
        
        return queryset

    @action(detail=False, methods=['get'])
    def pending(self, request):
        """Get pending reminders."""
        queryset = self.get_queryset().filter(
            status='pending',
            scheduled_for__lte=timezone.now()
        )
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
