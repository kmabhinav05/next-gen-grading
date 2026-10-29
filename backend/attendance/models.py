from django.db import models
from django.core.validators import MinValueValidator
from django.core.exceptions import ValidationError
from academics.models import Student, Subject

class Attendance(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='attendances')
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='attendances')
    classes_held = models.PositiveIntegerField(
        default=0,
        validators=[MinValueValidator(0)],
        help_text='Total number of lecture/lab classes conducted'
    )
    classes_attended = models.PositiveIntegerField(
        default=0,
        validators=[MinValueValidator(0)],
        help_text='Number of classes attended by the student'
    )
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('student', 'subject')
        ordering = ['student__reg_no']

    def clean(self):
        if self.classes_attended > self.classes_held:
            raise ValidationError(
                f"Classes attended ({self.classes_attended}) cannot exceed classes held ({self.classes_held})."
            )

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    @property
    def percentage(self):
        if self.classes_held == 0:
            return 100.0
        return round((self.classes_attended / self.classes_held) * 100, 1)

    @property
    def status_level(self):
        pct = self.percentage
        if pct < 75.0:
            return 'CRITICAL' # Red
        elif pct <= 85.0:
            return 'WARNING'  # Amber
        return 'NORMAL'       # Green

    def __str__(self):
        return f"{self.student.reg_no} - {self.subject.code}: {self.classes_attended}/{self.classes_held} ({self.percentage}%)"
