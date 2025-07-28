"""
Appointment serializers for PRM Backend.
"""

from rest_framework import serializers
from django.utils import timezone
from .models import Appointment, AppointmentHistory, AppointmentReminder
from apps.patients.serializers import PatientListSerializer
from apps.authentication.serializers import UserSerializer


class AppointmentHistorySerializer(serializers.ModelSerializer):
    """Serializer for appointment history."""
    created_by = UserSerializer(read_only=True)
    
    class Meta:
        model = AppointmentHistory
        fields = [
            'id', 'action', 'description', 'previous_data', 'new_data',
            'created_by', 'created_at'
        ]


class AppointmentReminderSerializer(serializers.ModelSerializer):
    """Serializer for appointment reminders."""
    
    class Meta:
        model = AppointmentReminder
        fields = [
            'id', 'reminder_type', 'scheduled_for', 'status',
            'message', 'sent_at', 'error_message', 'created_at'
        ]


class AppointmentSerializer(serializers.ModelSerializer):
    """Serializer for appointment model."""
    patient = PatientListSerializer(read_only=True)
    patient_id = serializers.IntegerField(write_only=True)
    psychologist = UserSerializer(read_only=True)
    psychologist_id = serializers.IntegerField(write_only=True, required=False)
    datetime = serializers.DateTimeField(read_only=True)
    end_time = serializers.TimeField(read_only=True)
    history = AppointmentHistorySerializer(many=True, read_only=True)
    reminders = AppointmentReminderSerializer(many=True, read_only=True)
    can_be_cancelled = serializers.BooleanField(read_only=True)
    can_be_rescheduled = serializers.BooleanField(read_only=True)
    is_today = serializers.BooleanField(read_only=True)
    is_upcoming = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = Appointment
        fields = [
            'id', 'patient', 'patient_id', 'psychologist', 'psychologist_id',
            'date', 'time', 'datetime', 'end_time', 'duration',
            'appointment_type', 'status', 'priority',
            'room', 'virtual_link', 'reason', 'notes', 'private_notes',
            'reminder_sent', 'reminder_sent_at',
            'requires_followup', 'followup_date',
            'history', 'reminders',
            'can_be_cancelled', 'can_be_rescheduled', 'is_today', 'is_upcoming',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'datetime', 'end_time', 'reminder_sent', 'reminder_sent_at',
            'created_at', 'updated_at'
        ]

    def validate(self, attrs):
        """Validate appointment data."""
        date = attrs.get('date')
        time = attrs.get('time')
        
        if date and time:
            appointment_datetime = timezone.datetime.combine(date, time)
            
            # Check if appointment is in the past
            if appointment_datetime < timezone.now():
                raise serializers.ValidationError(
                    "No se puede programar una cita en el pasado."
                )
        
        return attrs

    def validate_patient_id(self, value):
        """Validate patient exists."""
        from apps.patients.models import Patient
        try:
            Patient.objects.get(id=value)
            return value
        except Patient.DoesNotExist:
            raise serializers.ValidationError("Paciente no encontrado.")

    def validate_psychologist_id(self, value):
        """Validate psychologist exists."""
        if value:
            from apps.authentication.models import User
            try:
                User.objects.get(id=value, role='psychologist')
                return value
            except User.DoesNotExist:
                raise serializers.ValidationError("Psicólogo no encontrado.")
        return value

    def create(self, validated_data):
        """Create appointment with history entry."""
        validated_data['created_by'] = self.context['request'].user
        
        # Set psychologist if not provided
        if not validated_data.get('psychologist_id'):
            validated_data['psychologist_id'] = self.context['request'].user.id
        
        appointment = super().create(validated_data)
        
        # Create history entry
        AppointmentHistory.objects.create(
            appointment=appointment,
            action='created',
            description='Cita creada',
            new_data=validated_data,
            created_by=self.context['request'].user
        )
        
        return appointment

    def update(self, instance, validated_data):
        """Update appointment with history entry."""
        # Store previous data
        previous_data = {
            'date': str(instance.date),
            'time': str(instance.time),
            'status': instance.status,
            'appointment_type': instance.appointment_type,
        }
        
        appointment = super().update(instance, validated_data)
        
        # Create history entry
        AppointmentHistory.objects.create(
            appointment=appointment,
            action='updated',
            description='Cita actualizada',
            previous_data=previous_data,
            new_data=validated_data,
            created_by=self.context['request'].user
        )
        
        return appointment


class AppointmentListSerializer(serializers.ModelSerializer):
    """Simplified serializer for appointment list."""
    patient_name = serializers.CharField(source='patient.full_name', read_only=True)
    psychologist_name = serializers.CharField(source='psychologist.full_name', read_only=True)
    datetime = serializers.DateTimeField(read_only=True)
    
    class Meta:
        model = Appointment
        fields = [
            'id', 'patient_name', 'psychologist_name', 'date', 'time',
            'datetime', 'duration', 'appointment_type', 'status',
            'priority', 'room', 'is_today', 'is_upcoming'
        ]


class AppointmentCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating appointments."""
    
    class Meta:
        model = Appointment
        fields = [
            'patient', 'psychologist', 'date', 'time', 'duration',
            'appointment_type', 'priority', 'room', 'virtual_link',
            'reason', 'notes', 'requires_followup', 'followup_date'
        ]

    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)


class AppointmentCalendarSerializer(serializers.ModelSerializer):
    """Serializer for calendar view."""
    title = serializers.SerializerMethodField()
    start = serializers.SerializerMethodField()
    end = serializers.SerializerMethodField()
    color = serializers.SerializerMethodField()
    
    class Meta:
        model = Appointment
        fields = [
            'id', 'title', 'start', 'end', 'color',
            'status', 'appointment_type', 'priority'
        ]

    def get_title(self, obj):
        return f"{obj.patient.full_name} - {obj.get_appointment_type_display()}"

    def get_start(self, obj):
        return obj.datetime.isoformat()

    def get_end(self, obj):
        end_datetime = obj.datetime + timezone.timedelta(minutes=obj.duration)
        return end_datetime.isoformat()

    def get_color(self, obj):
        color_map = {
            'scheduled': '#3b82f6',  # blue
            'confirmed': '#10b981',  # green
            'in_progress': '#f59e0b',  # yellow
            'completed': '#6b7280',  # gray
            'cancelled': '#ef4444',  # red
            'no_show': '#8b5cf6',  # purple
        }
        return color_map.get(obj.status, '#3b82f6')
