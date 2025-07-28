"""
Appointment URLs for PRM Backend.
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AppointmentViewSet, AppointmentHistoryViewSet, AppointmentReminderViewSet

router = DefaultRouter()
router.register(r'', AppointmentViewSet)
router.register(r'history', AppointmentHistoryViewSet)
router.register(r'reminders', AppointmentReminderViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
