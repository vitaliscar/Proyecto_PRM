"""
Custom permissions for PRM Backend.
"""

from rest_framework import permissions


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit it.
    """

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed to the owner of the object.
        return obj.owner == request.user


class IsAdministratorOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow administrators to edit.
    """

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return request.user.is_authenticated
        
        return request.user.is_authenticated and request.user.role == 'administrator'


class IsPsychologistOrAdministrator(permissions.BasePermission):
    """
    Custom permission for psychologists and administrators.
    """

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and 
            request.user.role in ['psychologist', 'administrator']
        )


class IsPatientOwnerOrPsychologist(permissions.BasePermission):
    """
    Custom permission for patient data access.
    """

    def has_object_permission(self, request, view, obj):
        # Administrators and psychologists have full access
        if request.user.role in ['administrator', 'psychologist']:
            return True
        
        # Patients can only access their own data
        if request.user.role == 'patient':
            return obj.patient.user == request.user or obj == request.user
        
        return False
