"""
Appointment admin for PRM Backend.
"""

from django.contrib import admin
from .models import Appointment, AppointmentHistory, AppointmentReminder


@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = [
        'patient', 'psychologist', 'date', 'time', 'duration',
        'appointment_type', 'status', 'priority', 'created_at'
    ]
    list_filter = [
        'status', 'appointment_type', 'priority', 'date',
        'psychologist', 'created_at'
    ]
    search_fields = [
        'patient__first_name', 'patient__last_name', 'patient__cedula',
        'psychologist__first_name', 'psychologist__last_name', 'reason'
    ]
    raw_id_fields = ['patient', 'psychologist', 'created_by']
    readonly_fields = ['datetime', 'end_time', 'created_at', 'updated_at']
    
    fieldsets = (
        ('Información Básica', {
            'fields': ('patient', 'psychologist', 'date', 'time', 'duration')
        }),
        ('Tipo y Estado', {
            'fields': ('appointment_type', 'status', 'priority')
        }),
        ('Ubicación', {
            'fields': ('room', 'virtual_link')
        }),
        ('Notas', {
            'fields': ('reason', 'notes', 'private_notes')
        }),
        ('Recordatorios', {
            'fields': ('reminder_sent', 'reminder_sent_at')
        }),
        ('Seguimiento', {
            'fields': ('requires_followup', 'followup_date')
        }),
        ('Metadatos', {
            'fields': ('created_by', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(AppointmentHistory)
class AppointmentHistoryAdmin(admin.ModelAdmin):
    list_display = ['appointment', 'action', 'created_by', 'created_at']
    list_filter = ['action', 'created_at']
    search_fields = ['appointment__patient__first_name', 'appointment__patient__last_name']
    raw_id_fields = ['appointment', 'created_by']
    readonly_fields = ['created_at']


@admin.register(AppointmentReminder)
class AppointmentReminderAdmin(admin.ModelAdmin):
    list_display = ['appointment', 'reminder_type', 'scheduled_for', 'status', 'sent_at']
    list_filter = ['reminder_type', 'status', 'scheduled_for']
    search_fields = ['appointment__patient__first_name', 'appointment__patient__last_name']
    raw_id_fields = ['appointment']
