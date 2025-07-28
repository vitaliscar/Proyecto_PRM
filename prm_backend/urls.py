"""
URL configuration for prm_backend project.
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView

urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),
    
    # API Documentation
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
    
    # API v1
    path('api/v1/auth/', include('apps.authentication.urls')),
    path('api/v1/patients/', include('apps.patients.urls')),
    path('api/v1/appointments/', include('apps.appointments.urls')),
    path('api/v1/assessments/', include('apps.assessments.urls')),
    path('api/v1/records/', include('apps.records.urls')),
    path('api/v1/agenda/', include('apps.agenda.urls')),
    path('api/v1/marketing/', include('apps.marketing.urls')),
    path('api/v1/billing/', include('apps.billing.urls')),
    path('api/v1/reports/', include('apps.reports.urls')),
    path('api/v1/resources/', include('apps.resources.urls')),
    path('api/v1/community/', include('apps.community.urls')),
    path('api/v1/telehealth/', include('apps.telehealth.urls')),
    path('api/v1/gamification/', include('apps.gamification.urls')),
    path('api/v1/progress/', include('apps.progress.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
