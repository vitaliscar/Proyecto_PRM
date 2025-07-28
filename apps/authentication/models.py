"""
Authentication models for PRM Backend.
"""

from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _


class User(AbstractUser):
    """
    Custom user model for PRM system.
    """
    ROLE_CHOICES = [
        ('administrator', _('Administrador')),
        ('psychologist', _('Psicólogo')),
        ('receptionist', _('Recepcionista')),
        ('patient', _('Paciente')),
    ]
    
    cedula = models.CharField(
        _('Cédula'),
        max_length=20,
        unique=True,
        help_text=_('Número de cédula de identidad')
    )
    role = models.CharField(
        _('Rol'),
        max_length=20,
        choices=ROLE_CHOICES,
        default='patient'
    )
    phone = models.CharField(
        _('Teléfono'),
        max_length=20,
        blank=True
    )
    is_active = models.BooleanField(
        _('Activo'),
        default=True
    )
    created_at = models.DateTimeField(
        _('Fecha de creación'),
        auto_now_add=True
    )
    updated_at = models.DateTimeField(
        _('Fecha de actualización'),
        auto_now=True
    )

    USERNAME_FIELD = 'cedula'
    REQUIRED_FIELDS = ['email', 'first_name', 'last_name']

    class Meta:
        verbose_name = _('Usuario')
        verbose_name_plural = _('Usuarios')
        db_table = 'auth_user'

    def __str__(self):
        return f"{self.get_full_name()} ({self.cedula})"

    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}".strip()

    def has_role(self, role):
        """Check if user has specific role."""
        return self.role == role

    def is_administrator(self):
        """Check if user is administrator."""
        return self.role == 'administrator'

    def is_psychologist(self):
        """Check if user is psychologist."""
        return self.role == 'psychologist'

    def is_patient(self):
        """Check if user is patient."""
        return self.role == 'patient'


class UserProfile(models.Model):
    """
    Extended user profile information.
    """
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='profile'
    )
    avatar = models.ImageField(
        _('Avatar'),
        upload_to='avatars/',
        blank=True,
        null=True
    )
    bio = models.TextField(
        _('Biografía'),
        blank=True
    )
    specialization = models.CharField(
        _('Especialización'),
        max_length=200,
        blank=True,
        help_text=_('Para psicólogos')
    )
    license_number = models.CharField(
        _('Número de licencia'),
        max_length=50,
        blank=True,
        help_text=_('Para psicólogos')
    )
    address = models.TextField(
        _('Dirección'),
        blank=True
    )
    emergency_contact = models.CharField(
        _('Contacto de emergencia'),
        max_length=200,
        blank=True
    )
    emergency_phone = models.CharField(
        _('Teléfono de emergencia'),
        max_length=20,
        blank=True
    )
    preferences = models.JSONField(
        _('Preferencias'),
        default=dict,
        blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = _('Perfil de Usuario')
        verbose_name_plural = _('Perfiles de Usuario')

    def __str__(self):
        return f"Perfil de {self.user.full_name}"
