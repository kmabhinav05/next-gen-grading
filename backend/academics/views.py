from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from accounts.permissions import IsAdminRole, IsStaffOrAdmin
from .models import Semester, Staff, Student, Parent, ParentStudent, Subject
from .serializers import (
    SemesterSerializer, StaffSerializer, StudentSerializer,
    ParentSerializer, ParentStudentSerializer, SubjectSerializer
)

class SemesterViewSet(viewsets.ModelViewSet):
    queryset = Semester.objects.all()
    serializer_class = SemesterSerializer
    permission_classes = [IsStaffOrAdmin]
    pagination_class = None

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminRole()]
        return [IsStaffOrAdmin()]


class StaffViewSet(viewsets.ModelViewSet):
    queryset = Staff.objects.select_related('user').prefetch_related('assigned_subjects').all()
    serializer_class = StaffSerializer
    permission_classes = [IsStaffOrAdmin]
    search_fields = ['user__first_name', 'user__last_name', 'user__username', 'department']
    filter_backends = [filters.SearchFilter]

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminRole()]
        return [IsStaffOrAdmin()]


class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.select_related('user', 'semester').all()
    serializer_class = StudentSerializer
    permission_classes = [IsStaffOrAdmin]
    search_fields = ['reg_no', 'user__first_name', 'user__last_name', 'user__username']
    filter_backends = [filters.SearchFilter]

    def get_queryset(self):
        queryset = super().get_queryset()
        semester_id = self.request.query_params.get('semester')
        section = self.request.query_params.get('section')
        if semester_id:
            queryset = queryset.filter(semester_id=semester_id)
        if section:
            queryset = queryset.filter(section=section)
        return queryset

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminRole()]
        return [IsStaffOrAdmin()]


class ParentViewSet(viewsets.ModelViewSet):
    queryset = Parent.objects.select_related('user').prefetch_related('children__student__user').all()
    serializer_class = ParentSerializer
    permission_classes = [IsAdminRole]
    search_fields = ['user__first_name', 'user__last_name', 'user__username']
    filter_backends = [filters.SearchFilter]


class ParentStudentViewSet(viewsets.ModelViewSet):
    queryset = ParentStudent.objects.select_related('parent__user', 'student__user', 'student__semester').all()
    serializer_class = ParentStudentSerializer
    permission_classes = [IsAdminRole]


class SubjectViewSet(viewsets.ModelViewSet):
    queryset = Subject.objects.select_related('semester', 'staff__user').all()
    serializer_class = SubjectSerializer
    permission_classes = [IsStaffOrAdmin]
    pagination_class = None

    def get_queryset(self):
        queryset = super().get_queryset()
        semester_id = self.request.query_params.get('semester')
        staff_id = self.request.query_params.get('staff')
        # If logged in as staff and not admin, default or optionally filter
        if self.request.user.role == 'STAFF' and self.request.query_params.get('my_subjects') == 'true':
            if hasattr(self.request.user, 'staff_profile'):
                queryset = queryset.filter(staff=self.request.user.staff_profile)
        if semester_id:
            queryset = queryset.filter(semester_id=semester_id)
        if staff_id:
            queryset = queryset.filter(staff_id=staff_id)
        return queryset

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdminRole()]
        return [IsStaffOrAdmin()]
