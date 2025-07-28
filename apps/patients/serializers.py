"""
Patient serializers for PRM Backend.
"""

from rest_framework import serializers
from .models import Patient, PatientConsent, PatientNote
from apps.authentication.serializers import UserSerializer


class PatientConsentSerializer(serializers.ModelSerializer):
    """Serializer for patient consent."""
    
    class Meta:
        model = PatientConsent
        fields = [
            'id', 'consent_type', 'title', 'description', 'status',
            'signed_date', 'expiry_date', 'document_file', 'digital_signature',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class PatientNoteSerializer(serializers.ModelSerializer):
    """Serializer for patient notes."""
    created_by = UserSerializer(read_only=True)
    
    class Meta:
        model = PatientNote
        fields = [
            'id', 'note_type', 'title', 'content', 'is_important',
            'is_private', 'created_by', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_by', 'created_at', 'updated_at']


class PatientSerializer(serializers.ModelSerializer):
    """Serializer for patient model."""
    full_name = serializers.CharField(read_only=True)
    age = serializers.IntegerField(read_only=True)
    assigned_psychologist = UserSerializer(read_only=True)
    assigned_psychologist_id = serializers.IntegerField(write_only=True, required=False)
    consents = PatientConsentSerializer(many=True, read_only=True)
    notes = PatientNoteSerializer(many=True, read_only=True)
    active_appointments_count = serializers.SerializerMethodField()
    completed_appointments_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Patient
        fields = [
            'id', 'cedula', 'first_name', 'last_name', 'full_name',
            'birth_date', 'age', 'gender', 'marital_status',
            'phone', 'email', 'address',
            'emergency_contact_name', 'emergency_contact_phone',
            'emergency_contact_relationship',
            'medical_history', 'allergies', 'medications',
            'status', 'assigned_psychologist', 'assigned_psychologist_id',
            'registration_date', 'last_appointment',
            'consents', 'notes',
            'active_appointments_count', 'completed_appointments_count',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'full_name', 'age', 'registration_date',
            'created_at', 'updated_at'
        ]

    def get_active_appointments_count(self, obj):
        return obj.get_active_appointments_count()

    def get_completed_appointments_count(self, obj):
        return obj.get_completed_appointments_count()

    def validate_cedula(self, value):
        """Validate cedula format."""
        from core.utils import validate_cedula
        if not validate_cedula(value):
            raise serializers.ValidationError("Formato de cédula inválido.")
        return value

    def validate_assigned_psychologist_id(self, value):
        """Validate assigned psychologist."""
        if value:
            from apps.authentication.models import User
            try:
                user = User.objects.get(id=value, role='psychologist')
                return value
            except User.DoesNotExist:
                raise serializers.ValidationError("Psicólogo no encontrado.")
        return value


class PatientListSerializer(serializers.ModelSerializer):
    """Simplified serializer for patient list."""
    full_name = serializers.CharField(read_only=True)
    age = serializers.IntegerField(read_only=True)
    assigned_psychologist_name = serializers.CharField(
        source='assigned_psychologist.full_name',
        read_only=True
    )
    
    class Meta:
        model = Patient
        fields = [
            'id', 'cedula', 'full_name', 'age', 'gender',
            'phone', 'email', 'status', 'assigned_psychologist_name',
            'last_appointment', 'created_at'
        ]


class PatientCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating patients."""
    
    class Meta:
        model = Patient
        fields = [
            'cedula', 'first_name', 'last_name', 'birth_date', 'gender',
            'marital_status', 'phone', 'email', 'address',
            'emergency_contact_name', 'emergency_contact_phone',
            'emergency_contact_relationship',
            'medical_history', 'allergies', 'medications',
            'assigned_psychologist'
        ]

    def validate_cedula(self, value):
        """Validate cedula format."""
        from core.utils import validate_cedula
        if not validate_cedula(value):
            raise serializers.ValidationError("Formato de cédula inválido.")
        return value

    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)
