from django.db import models
from django.core.validators import MinValueValidator
from django.core.exceptions import ValidationError
from academics.models import Student, Subject, Staff

class InternalMark(models.Model):
    class Assessment(models.TextChoices):
        IA1 = 'IA1', 'Internal Assessment 1'
        IA2 = 'IA2', 'Internal Assessment 2'
        IA3 = 'IA3', 'Internal Assessment 3'

    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='internal_marks')
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='internal_marks')
    assessment = models.CharField(max_length=5, choices=Assessment.choices)
    marks = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        validators=[MinValueValidator(0)],
        help_text='Marks scored in this assessment'
    )
    max_marks = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=50.00,
        help_text='Maximum marks for this assessment'
    )
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('student', 'subject', 'assessment')
        indexes = [
            models.Index(fields=['student', 'subject']),
            models.Index(fields=['subject', 'assessment']),
        ]

    def clean(self):
        if self.marks is not None and self.max_marks is not None:
            if self.marks > self.max_marks:
                raise ValidationError(f"Marks ({self.marks}) cannot exceed maximum marks ({self.max_marks}).")

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.student.reg_no} - {self.subject.code} - {self.assessment}: {self.marks}/{self.max_marks}"


class UploadLog(models.Model):
    class Status(models.TextChoices):
        SUCCESS = 'SUCCESS', 'Success'
        PARTIAL = 'PARTIAL', 'Partial'
        FAILED = 'FAILED', 'Failed'

    staff = models.ForeignKey(Staff, on_delete=models.SET_NULL, null=True, blank=True, related_name='upload_logs')
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='upload_logs')
    assessment = models.CharField(max_length=5, choices=InternalMark.Assessment.choices)
    filename = models.CharField(max_length=255)
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.SUCCESS)
    total_rows = models.IntegerField(default=0)
    valid_rows = models.IntegerField(default=0)
    invalid_rows = models.IntegerField(default=0)
    error_summary = models.TextField(blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"{self.timestamp.strftime('%Y-%m-%d %H:%M')} | {self.subject.code} {self.assessment} ({self.status})"
