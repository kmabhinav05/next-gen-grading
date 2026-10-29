from django.contrib import admin
from .models import Semester, Staff, Student, Parent, ParentStudent, Subject

@admin.register(Semester)
class SemesterAdmin(admin.ModelAdmin):
    list_display = ('number', 'academic_year')
    list_filter = ('academic_year', 'number')

@admin.register(Staff)
class StaffAdmin(admin.ModelAdmin):
    list_display = ('user', 'department', 'designation')
    search_fields = ('user__username', 'user__first_name', 'user__last_name', 'department')

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ('reg_no', 'user', 'semester', 'section', 'department')
    search_fields = ('reg_no', 'user__username', 'user__first_name', 'user__last_name')
    list_filter = ('semester', 'section', 'department')

@admin.register(Parent)
class ParentAdmin(admin.ModelAdmin):
    list_display = ('user', 'relationship')
    search_fields = ('user__username', 'user__first_name', 'user__last_name')

@admin.register(ParentStudent)
class ParentStudentAdmin(admin.ModelAdmin):
    list_display = ('parent', 'student', 'created_at')

@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display = ('code', 'name', 'semester', 'staff', 'max_internal_marks')
    list_filter = ('semester', 'staff')
    search_fields = ('code', 'name')
