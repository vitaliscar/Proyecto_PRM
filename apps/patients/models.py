"""
Patient models for PRM Backend.
"""

from django.db import models
from django.utils.translation import gettext_lazy as _
from core.utils import calculate_age


class Patient(models.Model):
    """
    Patient model for storing patient information.
    """
    GENDER_CHOICES = [
        ('male', _('Masculino')),
        ('female', _('Femenino')),
        ('other', _('Otro')),
    ]
    
    STATUS_CHOICES = [
        ('active', _('Activo')),
        ('inactive', _('Inactivo')),
        ('discharged', _('Dado de alta')),
    ]
    
    MARITAL_STATUS_CHOICES = [
        ('single', _('Soltero/a')),
        ('married', _('Casado/a')),
        ('divorced', _('Divorciado/a')),
        ('widowed', _('Viudo/a')),
        ('other', _('Otro')),
    ]
    
    # Basic Information
    cedula = models.CharField(
        _('Cédula'),
        max_length=20,
        unique=True
    )
    first_name = models.CharField(
        _('Nombres'),
        max_length=100
    )
    last_name = models.CharField(
        _('Apellidos'),
        max_length=100
    )
    birth_date = models.DateField(
        _('Fecha de nacimiento')
    )
    gender = models.CharField(
        _('Género'),
        max_length=10,
        choices=GENDER_CHOICES
    )
    marital_status = models.CharField(
        _('Estado civil'),
        max_length=20,
        choices=MARITAL_STATUS_CHOICES,
        blank=True
    )
    
    # Contact Information
    phone = models.CharField(
        _('Teléfono'),
        max_length=20
    )
    email = models.EmailField(
        _('Correo electrónico'),
        blank=True
    )
    address = models.TextField(
        _('Dirección')
    )
    
    # Emergency Contact
    emergency_contact_name = models.CharField(
        _('Nombre del contacto de emergencia'),
        max_length=200
    )
    emergency_contact_phone = models.CharField(
        _('Teléfono del contacto de emergencia'),
        max_length=20
    )
    emergency_contact_relationship = models.CharField(
        _('Relación con el contacto de emergencia'),
        max_length=100
    )
    
    # Medical Information
    medical_history = models.TextField(
        _('Historia médica'),
        blank=True
    )
    allergies = models.TextField(
        _('Alergias'),
        blank=True
    )
    medications = models.TextField(
        _('Medicamentos actuales'),
        blank=True
    )
    
    # Administrative
    status = models.CharField(
        _('Estado'),
        max_length=20,
        choices=STATUS_CHOICES,
        default='active'
    )
    assigned_psychologist = models.ForeignKey(
        'authentication.User',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='assigned_patients',
        limit_choices_to={'role': 'psychologist'}
    )
    registration_date = models.DateTimeField(
        _('Fecha de registro'),
        auto_now_add=True
    )
    last_appointment = models.DateTimeField(
        _('Última cita'),
        null=True,
        blank=True
    )
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        'authentication.User',
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_patients'
    )

    class Meta:
        verbose_name = _('Paciente')
        verbose_name_plural = _('Pacientes')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.cedula})"

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}".strip()

    @property
    def age(self):
        return calculate_age(self.birth_date)

    def get_active_appointments_count(self):
        """Get count of active appointments."""
        return self.appointments.filter(
            status__in=['scheduled', 'confirmed']
        ).count()

    def get_completed_appointments_count(self):
        """Get count of completed appointments."""
        return self.appointments.filter(status='completed').count()


class PatientConsent(models.Model):
    """
    Model for storing patient consent forms.
    """
    CONSENT_TYPES = [
        ('treatment', _('Consentimiento de tratamiento')),
        ('privacy', _('Consentimiento de privacidad')),
        ('photography', _('Consentimiento de fotografía')),
        ('research', _('Consentimiento de investigación')),
        ('other', _('Otro')),
    ]
    
    STATUS_CHOICES = [
        ('pending', _('Pendiente')),
        ('signed', _('Firmado')),
        ('declined', _('Rechazado')),
        ('expired', _('Expirado')),
    ]
    
    patient = models.ForeignKey(
        Patient,
        on_delete=models.CASCADE,
        related_name='consents'
    )
    consent_type = models.CharField(
        _('Tipo de consentimiento'),
        max_length=20,
        choices=CONSENT_TYPES
    )
    title = models.CharField(
        _('Título'),
        max_length=200
    )
    description = models.TextField(
        _('Descripción')
    )
    status = models.CharField(
        _('Estado'),
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )
    signed_date = models.DateTimeField(
        _('Fecha de firma'),
        null=True,
        blank=True
    )
    expiry_date = models.DateTimeField(
        _('Fecha de expiración'),
        null=True,
        blank=True
    )
    document_file = models.FileField(
        _('Archivo del documento'),
        upload_to='consents/',
        blank=True
    )
    digital_signature = models.TextField(
        _('Firma digital'),
        blank=True
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _('Consentimiento del Paciente')
        verbose_name_plural = _('Consentimientos de Pacientes')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} - {self.patient.full_name}"


class PatientNote(models.Model):
    """
    Model for storing patient notes.
    """
    NOTE_TYPES = [
        ('general', _('General')),
        ('clinical', _('Clínica')),
        ('administrative', _('Administrativa')),
        ('reminder', _('Recordatorio')),
    ]
    
    patient = models.ForeignKey(
        Patient,
        on_delete=models.CASCADE,
        related_name='notes'
    )
    note_type = models.CharField(
        _('Tipo de nota'),
        max_length=20,
        choices=NOTE_TYPES,
        default='general'
    )
    title = models.CharField(
        _('Título'),
        max_length=200
    )
    content = models.TextField(
        _('Contenido')
    )
    is_important = models.BooleanField(
        _('Importante'),
        default=False
    )
    is_private = models.BooleanField(
        _('Privada'),
        default=False,
        help_text=_('Solo visible para psicólogos y administradores')
    )
    
    created_by = models.ForeignKey(
        'authentication.User',
        on_delete=models.CASCADE,
        related_name='patient_notes'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _('Nota del Paciente')
        verbose_name_plural = _('Notas de Pacientes')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} - {self.patient.full_name}"
