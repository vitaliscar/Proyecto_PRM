"""
Patient admin for PRM Backend.
"""

from django.contrib import admin
from .models import Patient, PatientConsent, PatientNote


@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = [
        'cedula', 'first_name', 'last_name', 'age', 'gender',
        'status', 'assigned_psychologist', 'created_at'
    ]
    list_filter = ['status', 'gender', 'assigned_psychologist', 'created_at']
    search_fields = ['cedula', 'first_name', 'last_name', 'phone', 'email']
    raw_id_fields = ['assigned_psychologist', 'created_by']
    readonly_fields = ['age', 'created_at', 'updated_at']
    
    fieldsets = (
        ('Información Personal', {
            'fields': (
                'cedula', 'first_name', 'last_name', 'birth_date',
                'gender', 'marital_status'
            )
        }),
        ('Información de Contacto', {
            'fields': ('phone', 'email', 'address')
        }),
        ('Contacto de Emergencia', {
            'fields': (
                'emergency_contact_name', 'emergency_contact_phone',
                'emergency_contact_relationship'
            )
        }),
        ('Información Médica', {
            'fields': ('medical_history', 'allergies', 'medications')
        }),
        ('Administrativo', {
            'fields': (
                'status', 'assigned_psychologist', 'last_appointment'
            )
        }),
        ('Metadatos', {
            'fields': ('created_by', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(PatientConsent)
class PatientConsentAdmin(admin.ModelAdmin):
    list_display = ['patient', 'title', 'consent_type', 'status', 'signed_date']
    list_filter = ['consent_type', 'status', 'created_at']
    search_fields = ['patient__first_name', 'patient__last_name', 'title']
    raw_id_fields = ['patient']


@admin.register(PatientNote)
class PatientNoteAdmin(admin.ModelAdmin):
    list_display = ['patient', 'title', 'note_type', 'is_important', 'created_by', 'created_at']
    list_filter = ['note_type', 'is_important', 'is_private', 'created_at']
    search_fields = ['patient__first_name', 'patient__last_name', 'title', 'content']
    raw_id_fields = ['patient', 'created_by']
