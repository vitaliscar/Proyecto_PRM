"""
Celery configuration for PRM Backend
Updated for Celery 5.3+ and Python 3.13
"""

import os
from celery import Celery
from django.conf import settings

# Set the default Django settings module for the 'celery' program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'prm_backend.settings.development')

app = Celery('prm_backend')

# Using a string here means the worker doesn't have to serialize
# the configuration object to child processes.
app.config_from_object('django.conf:settings', namespace='CELERY')

# Load task modules from all registered Django apps.
app.autodiscover_tasks()

# Celery Beat configuration
app.conf.beat_schedule = {
    'send-appointment-reminders': {
        'task': 'apps.appointments.tasks.send_appointment_reminders',
        'schedule': 300.0,  # Every 5 minutes
    },
    'cleanup-expired-tokens': {
        'task': 'apps.authentication.tasks.cleanup_expired_tokens',
        'schedule': 3600.0,  # Every hour
    },
    'generate-daily-reports': {
        'task': 'apps.reports.tasks.generate_daily_reports',
        'schedule': 86400.0,  # Every day
    },
    'backup-database': {
        'task': 'apps.core.tasks.backup_database',
        'schedule': 86400.0,  # Every day
    },
}

app.conf.timezone = 'America/Caracas'

@app.task(bind=True, ignore_result=True)
def debug_task(self):
    print(f'Request: {self.request!r}')
