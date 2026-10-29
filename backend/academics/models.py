from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator

class Semester(models.Model):
    number = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(8)],
        help_text='Semester number (1 through 8)'
    )
    academic_year = models.CharField(
        max_length=20,
        help_text='e.g., 2026-2027 or 2025-2026'
    )

    class Meta:
        ordering = ['-academic_year', 'number']
        unique_together = ('number', 'academic_year')

    def __str__(self):
        return f"Semester {self.number} ({self.academic_year})"


class Staff(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='staff_profile'
    )
    department = models.CharField(max_length=100, default='Computer Science & Engineering')
    designation = models.CharField(max_length=100, default='Assistant Professor')

    def __str__(self):
        return f"{self.user.get_full_name() or self.user.username} - {self.department}"


class Student(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='student_profile'
    )
    reg_no = models.CharField(
        max_length=30,
        unique=True,
        db_index=True,
        help_text='Unique university/college register number'
    )
    department = models.CharField(max_length=100, default='Computer Science & Engineering')
    semester = models.ForeignKey(
        Semester,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='students'
    )
    section = models.CharField(max_length=10, default='A')

    class Meta:
        ordering = ['reg_no']

    def __str__(self):
        return f"{self.reg_no} - {self.user.get_full_name() or self.user.username} (Sec {self.section})"


class Parent(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='parent_profile'
    )
    relationship = models.CharField(max_length=30, default='Parent / Guardian')

    def __str__(self):
        return f"Parent: {self.user.get_full_name() or self.user.username}"


class ParentStudent(models.Model):
    parent = models.ForeignKey(Parent, on_delete=models.CASCADE, related_name='children')
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='parents')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('parent', 'student')

    def __str__(self):
        return f"{self.parent} -> {self.student}"


class Subject(models.Model):
    code = models.CharField(max_length=20, unique=True, help_text='Course code e.g. CS501')
    name = models.CharField(max_length=150, help_text='Course Name e.g. Database Management Systems')
    semester = models.ForeignKey(
        Semester,
        on_delete=models.CASCADE,
        related_name='subjects'
    )
    staff = models.ForeignKey(
        Staff,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='assigned_subjects'
    )
    max_internal_marks = models.PositiveIntegerField(
        default=50,
        help_text='Maximum marks per IA assessment (usually 50 or 100)'
    )

    class Meta:
        ordering = ['code']

    def __str__(self):
        return f"{self.code} - {self.name}"
