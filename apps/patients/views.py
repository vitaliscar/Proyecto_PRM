"""
Patient views for PRM Backend.
"""

from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Patient, PatientConsent, PatientNote
from .serializers import (
    PatientSerializer, PatientListSerializer, PatientCreateSerializer,
    PatientConsentSerializer, PatientNoteSerializer
)
from core.permissions import IsPsychologistOrAdministrator, IsPatientOwnerOrPsychologist


class PatientViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing patients.
    """
    queryset = Patient.objects.all()
    permission_classes = [IsPsychologistOrAdministrator]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status', 'gender', 'assigned_psychologist']
    search_fields = ['cedula', 'first_name', 'last_name', 'phone', 'email']
    ordering_fields = ['created_at', 'first_name', 'last_name', 'last_appointment']
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.action == 'list':
            return PatientListSerializer
        elif self.action == 'create':
            return PatientCreateSerializer
        return PatientSerializer

    def get_queryset(self):
        queryset = Patient.objects.all()
        
        # Filter by assigned psychologist if user is psychologist
        if self.request.user.role == 'psychologist':
            queryset = queryset.filter(assigned_psychologist=self.request.user)
        
        return queryset

    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        """Update patient status."""
        patient = self.get_object()
        new_status = request.data.get('status')
        
        if new_status not in dict(Patient.STATUS_CHOICES):
            return Response(
                {'error': 'Estado inválido'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        patient.status = new_status
        patient.save()
        
        return Response({
            'message': 'Estado actualizado exitosamente',
            'status': patient.status
        })

    @action(detail=True, methods=['post'])
    def assign_psychologist(self, request, pk=None):
        """Assign psychologist to patient."""
        patient = self.get_object()
        psychologist_id = request.data.get('psychologist_id')
        
        if not psychologist_id:
            return Response(
                {'error': 'ID del psicólogo requerido'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            from apps.authentication.models import User
            psychologist = User.objects.get(id=psychologist_id, role='psychologist')
            patient.assigned_psychologist = psychologist
            patient.save()
            
            return Response({
                'message': 'Psicólogo asignado exitosamente',
                'psychologist': psychologist.full_name
            })
        except User.DoesNotExist:
            return Response(
                {'error': 'Psicólogo no encontrado'},
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=True, methods=['get'])
    def appointments(self, request, pk=None):
        """Get patient appointments."""
        patient = self.get_object()
        appointments = patient.appointments.all().order_by('-date', '-time')
        
        # Import here to avoid circular imports
        from apps.appointments.serializers import AppointmentSerializer
        serializer = AppointmentSerializer(appointments, many=True)
        
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def assessments(self, request, pk=None):
        """Get patient assessments."""
        patient = self.get_object()
        assessments = patient.assessments.all().order_by('-date')
        
        # Import here to avoid circular imports
        from apps.assessments.serializers import AssessmentSerializer
        serializer = AssessmentSerializer(assessments, many=True)
        
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """Get patient statistics."""
        queryset = self.get_queryset()
        
        stats = {
            'total': queryset.count(),
            'active': queryset.filter(status='active').count(),
            'inactive': queryset.filter(status='inactive').count(),
            'discharged': queryset.filter(status='discharged').count(),
            'by_gender': {
                'male': queryset.filter(gender='male').count(),
                'female': queryset.filter(gender='female').count(),
                'other': queryset.filter(gender='other').count(),
            },
            'with_psychologist': queryset.filter(assigned_psychologist__isnull=False).count(),
            'without_psychologist': queryset.filter(assigned_psychologist__isnull=True).count(),
        }
        
        return Response(stats)


class PatientConsentViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing patient consents.
    """
    queryset = PatientConsent.objects.all()
    serializer_class = PatientConsentSerializer
    permission_classes = [IsPatientOwnerOrPsychologist]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['patient', 'consent_type', 'status']
    ordering = ['-created_at']

    def get_queryset(self):
        queryset = PatientConsent.objects.all()
        
        # Filter by patient if user is psychologist
        if self.request.user.role == 'psychologist':
            queryset = queryset.filter(patient__assigned_psychologist=self.request.user)
        
        return queryset

    @action(detail=True, methods=['post'])
    def sign(self, request, pk=None):
        """Sign consent form."""
        consent = self.get_object()
        digital_signature = request.data.get('digital_signature')
        
        if not digital_signature:
            return Response(
                {'error': 'Firma digital requerida'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        consent.digital_signature = digital_signature
        consent.status = 'signed'
        consent.signed_date = timezone.now()
        consent.save()
        
        return Response({
            'message': 'Consentimiento firmado exitosamente',
            'status': consent.status
        })


class PatientNoteViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing patient notes.
    """
    queryset = PatientNote.objects.all()
    serializer_class = PatientNoteSerializer
    permission_classes = [IsPsychologistOrAdministrator]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['patient', 'note_type', 'is_important', 'is_private']
    search_fields = ['title', 'content']
    ordering = ['-created_at']

    def get_queryset(self):
        queryset = PatientNote.objects.all()
        
        # Filter by patient if user is psychologist
        if self.request.user.role == 'psychologist':
            queryset = queryset.filter(patient__assigned_psychologist=self.request.user)
        
        return queryset

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
