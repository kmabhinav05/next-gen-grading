from rest_framework import permissions

class IsAdminRole(permissions.BasePermission):
    """Allows access only to users with the ADMIN role."""
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and (request.user.role == 'ADMIN' or request.user.is_superuser))

class IsStaffRole(permissions.BasePermission):
    """Allows access only to users with the STAFF role."""
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'STAFF')

class IsStudentRole(permissions.BasePermission):
    """Allows access only to users with the STUDENT role."""
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'STUDENT')

class IsParentRole(permissions.BasePermission):
    """Allows access only to users with the PARENT role."""
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == 'PARENT')

class IsStaffOrAdmin(permissions.BasePermission):
    """Allows access to either Staff or Admin."""
    def has_permission(self, request, view):
        return bool(
            request.user and request.user.is_authenticated and
            (request.user.role in ['ADMIN', 'STAFF'] or request.user.is_superuser)
        )

class CanAccessStudentData(permissions.BasePermission):
    """
    Object-level permission check:
    - Admin: full access
    - Staff: can access students within their department/assigned subjects
    - Student: can only access their own student record
    - Parent: can only access their linked child's student record
    """
    def has_object_permission(self, request, view, obj):
        user = request.user
        if not user or not user.is_authenticated:
            return False
        if user.role == 'ADMIN' or user.is_superuser:
            return True
        if user.role == 'STAFF':
            # Staff can view class records
            return True
        if user.role == 'STUDENT':
            student_id = getattr(obj, 'student_id', getattr(obj, 'id', None))
            return hasattr(user, 'student_profile') and user.student_profile.id == student_id
        if user.role == 'PARENT':
            student_id = getattr(obj, 'student_id', getattr(obj, 'id', None))
            if hasattr(user, 'parent_profile'):
                return user.parent_profile.children.filter(student_id=student_id).exists()
        return False
