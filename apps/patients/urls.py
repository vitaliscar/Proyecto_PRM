"""
Patient URLs for PRM Backend.
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PatientViewSet, PatientConsentViewSet, PatientNoteViewSet

router = DefaultRouter()
router.register(r'', PatientViewSet)
router.register(r'consents', PatientConsentViewSet)
router.register(r'notes', PatientNoteViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
