"""
Utility functions for PRM Backend.
"""

import uuid
import os
from django.utils.text import slugify
from django.core.mail import send_mail
from django.conf import settings
from datetime import datetime, timedelta


def generate_unique_filename(instance, filename):
    """
    Generate a unique filename for uploaded files.
    """
    ext = filename.split('.')[-1]
    filename = f"{uuid.uuid4()}.{ext}"
    return os.path.join('uploads', filename)


def send_notification_email(to_email, subject, message):
    """
    Send notification email.
    """
    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[to_email],
            fail_silently=False,
        )
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False


def calculate_age(birth_date):
    """
    Calculate age from birth date.
    """
    today = datetime.now().date()
    return today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))


def get_next_appointment_slot(duration_minutes=60):
    """
    Get the next available appointment slot.
    """
    now = datetime.now()
    # Round to next hour
    next_slot = now.replace(minute=0, second=0, microsecond=0) + timedelta(hours=1)
    return next_slot


def format_cedula(cedula):
    """
    Format Venezuelan cedula number.
    """
    if not cedula:
        return ""
    
    # Remove any non-digit characters
    cedula = ''.join(filter(str.isdigit, cedula))
    
    # Format as V-12.345.678
    if len(cedula) >= 7:
        return f"V-{cedula[:-6]}.{cedula[-6:-3]}.{cedula[-3:]}"
    
    return cedula


def validate_cedula(cedula):
    """
    Validate Venezuelan cedula format.
    """
    if not cedula:
        return False
    
    # Remove formatting
    cedula_digits = ''.join(filter(str.isdigit, cedula))
    
    # Should have 7-8 digits
    return len(cedula_digits) >= 7 and len(cedula_digits) <= 8
