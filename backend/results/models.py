from django.db import models
from academics.models import Student, Semester

class SemesterResult(models.Model):
    """
    FUTURE-READY MODULE: Semester Results from Controller of Examinations.
    
    PLANNED FLOW:
    1. Student or Exam Cell uploads official University result PDF/gazette.
    2. Backend extracts tabular grade data using `pdfplumber` (Subject Code, Grade, Grade Points, Result Status).
    3. Merges internal marks (from `marks.InternalMark`) + external marks into unified grade sheet.
    4. Computes SGPA and CGPA.
    """
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='semester_results', null=True, blank=True)
    semester = models.ForeignKey(Semester, on_delete=models.CASCADE, related_name='results', null=True, blank=True)
    sgpa = models.DecimalField(max_digits=4, decimal_places=2, null=True, blank=True)
    cgpa = models.DecimalField(max_digits=4, decimal_places=2, null=True, blank=True)
    result_pdf = models.FileField(upload_to='results_pdfs/', null=True, blank=True)
    is_processed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"SemesterResult (Future Placeholder): {self.student} - Sem {self.semester}"
