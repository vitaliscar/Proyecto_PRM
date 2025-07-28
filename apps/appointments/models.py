"""
Appointment models for PRM Backend.
"""

from django.db import models
from django.utils.translation import gettext_lazy as _
from django.core.exceptions import ValidationError
from datetime import datetime, timedelta


class Appointment(models.Model):
    """
    Appointment model for scheduling patient appointments.
    """
    TYPE_CHOICES = [
        ('presencial', _('Presencial')),
        ('virtual', _('Virtual')),
        ('telefonica', _('Telefónica')),
    ]
    
    STATUS_CHOICES = [
        ('scheduled', _('Programada')),
        ('confirmed', _('Confirmada')),
        ('in_progress', _('En Progreso')),
        ('completed', _('Completada')),
        ('cancelled', _('Cancelada')),
        ('no_show', _('No asistió')),
    ]
    
    PRIORITY_CHOICES = [
        ('low', _('Baja')),
        ('normal', _('Normal')),
        ('high', _('Alta')),
        ('urgent', _('Urgente')),
    ]
    
    # Basic Information
    patient = models.ForeignKey(
        'patients.Patient',
        on_delete=models.CASCADE,
        related_name='appointments'
    )
    psychologist = models.ForeignKey(
        'authentication.User',
        on_delete=models.CASCADE,
        related_name='appointments',
        limit_choices_to={'role': 'psychologist'}
    )
    
    # Scheduling
    date = models.DateField(_('Fecha'))
    time = models.TimeField(_('Hora'))
    duration = models.IntegerField(
        _('Duración (minutos)'),
        default=60
    )
    
    # Type and Status
    appointment_type = models.CharField(
        _('Tipo de cita'),
        max_length=20,
        choices=TYPE_CHOICES,
        default='presencial'
    )
    status = models.CharField(
        _('Estado'),
        max_length=20,
        choices=STATUS_CHOICES,
        default='scheduled'
    )
    priority = models.CharField(
        _('Prioridad'),
        max_length=20,
        choices=PRIORITY_CHOICES,
        default='normal'
    )
    
    # Location/Virtual Info
    room = models.CharField(
        _('Sala/Consultorio'),
        max_length=100,
        blank=True
    )
    virtual_link = models.URLField(
        _('Enlace virtual'),
        blank=True
    )
    
    # Notes and Observations
    reason = models.TextField(
        _('Motivo de la cita'),
        blank=True
    )
    notes = models.TextField(
        _('Notas'),
        blank=True
    )
    private_notes = models.TextField(
        _('Notas privadas'),
        blank=True,
        help_text=_('Solo visible para el psicólogo')
    )
    
    # Reminders and Notifications
    reminder_sent = models.BooleanField(
        _('Recordatorio enviado'),
        default=False
    )
    reminder_sent_at = models.DateTimeField(
        _('Recordatorio enviado el'),
        null=True,
        blank=True
    )
    
    # Follow-up
    requires_followup = models.BooleanField(
        _('Requiere seguimiento'),
        default=False
    )
    followup_date = models.DateField(
        _('Fecha de seguimiento'),
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
        related_name='created_appointments'
    )

    class Meta:
        verbose_name = _('Cita')
        verbose_name_plural = _('Citas')
        ordering = ['date', 'time']
        unique_together = ['psychologist', 'date', 'time']

    def __str__(self):
        return f"{self.patient.full_name} - {self.date} {self.time}"

    def clean(self):
        """Validate appointment data."""
        if self.date and self.time:
            appointment_datetime = datetime.combine(self.date, self.time)
            
            # Check if appointment is in the past
            if appointment_datetime < datetime.now():
                raise ValidationError("No se puede programar una cita en el pasado.")
            
            # Check for overlapping appointments
            overlapping = Appointment.objects.filter(
                psychologist=self.psychologist,
                date=self.date,
                time__range=(
                    (datetime.combine(self.date, self.time) - timedelta(minutes=self.duration)).time(),
                    (datetime.combine(self.date, self.time) + timedelta(minutes=self.duration)).time()
                ),
                status__in=['scheduled', 'confirmed', 'in_progress']
            ).exclude(pk=self.pk)
            
            if overlapping.exists():
                raise ValidationError("El psicólogo ya tiene una cita programada en este horario.")

    @property
    def datetime(self):
        """Get appointment datetime."""
        return datetime.combine(self.date, self.time)

    @property
    def end_time(self):
        """Get appointment end time."""
        return (self.datetime + timedelta(minutes=self.duration)).time()

    def can_be_cancelled(self):
        """Check if appointment can be cancelled."""
        return self.status in ['scheduled', 'confirmed']

    def can_be_rescheduled(self):
        """Check if appointment can be rescheduled."""
        return self.status in ['scheduled', 'confirmed']

    def is_today(self):
        """Check if appointment is today."""
        from django.utils import timezone
        return self.date == timezone.now().date()

    def is_upcoming(self):
        """Check if appointment is upcoming."""
        from django.utils import timezone
        return self.datetime > timezone.now()


class AppointmentHistory(models.Model):
    """
    Model to track appointment changes.
    """
    ACTION_CHOICES = [
        ('created', _('Creada')),
        ('updated', _('Actualizada')),
        ('cancelled', _('Cancelada')),
        ('rescheduled', _('Reprogramada')),
        ('completed', _('Completada')),
        ('no_show', _('No asistió')),
    ]
    
    appointment = models.ForeignKey(
        Appointment,
        on_delete=models.CASCADE,
        related_name='history'
    )
    action = models.CharField(
        _('Acción'),
        max_length=20,
        choices=ACTION_CHOICES
    )
    description = models.TextField(
        _('Descripción'),
        blank=True
    )
    previous_data = models.JSONField(
        _('Datos anteriores'),
        null=True,
        blank=True
    )
    new_data = models.JSONField(
        _('Datos nuevos'),
        null=True,
        blank=True
    )
    
    created_by = models.ForeignKey(
        'authentication.User',
        on_delete=models.SET_NULL,
        null=True
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = _('Historial de Cita')
        verbose_name_plural = _('Historiales de Citas')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.appointment} - {self.get_action_display()}"


class AppointmentReminder(models.Model):
    """
    Model for appointment reminders.
    """
    REMINDER_TYPES = [
        ('email', _('Correo electrónico')),
        ('sms', _('SMS')),
        ('whatsapp', _('WhatsApp')),
        ('call', _('Llamada')),
    ]
    
    STATUS_CHOICES = [
        ('pending', _('Pendiente')),
        ('sent', _('Enviado')),
        ('failed', _('Fallido')),
    ]
    
    appointment = models.ForeignKey(
        Appointment,
        on_delete=models.CASCADE,
        related_name='reminders'
    )
    reminder_type = models.CharField(
        _('Tipo de recordatorio'),
        max_length=20,
        choices=REMINDER_TYPES
    )
    scheduled_for = models.DateTimeField(
        _('Programado para')
    )
    status = models.CharField(
        _('Estado'),
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )
    message = models.TextField(
        _('Mensaje'),
        blank=True
    )
    sent_at = models.DateTimeField(
        _('Enviado el'),
        null=True,
        blank=True
    )
    error_message = models.TextField(
        _('Mensaje de error'),
        blank=True
    )
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = _('Recordatorio de Cita')
        verbose_name_plural = _('Recordatorios de Citas')
        ordering = ['scheduled_for']

    def __str__(self):
        return f"Recordatorio {self.get_reminder_type_display()} - {self.appointment}"
