from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    SemesterViewSet, StaffViewSet, StudentViewSet,
    ParentViewSet, ParentStudentViewSet, SubjectViewSet
)

router = DefaultRouter()
router.register(r'semesters', SemesterViewSet, basename='semester')
router.register(r'staff', StaffViewSet, basename='staff')
router.register(r'students', StudentViewSet, basename='student')
router.register(r'parents', ParentViewSet, basename='parent')
router.register(r'parent-student', ParentStudentViewSet, basename='parent-student')
router.register(r'subjects', SubjectViewSet, basename='subject')

urlpatterns = [
    path('', include(router.urls)),
]
