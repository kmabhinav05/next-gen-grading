from django.test import TestCase
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model
from academics.models import Semester, Student, Subject
from marks.models import InternalMark

User = get_user_model()

class InternalMarksTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='stu_test', password='password123', role='STUDENT')
        self.sem = Semester.objects.create(number=5, academic_year='2026-2027')
        self.student = Student.objects.create(user=self.user, reg_no='21TEST001', semester=self.sem)
        self.subject = Subject.objects.create(code='CS999', name='Test Course', semester=self.sem, max_internal_marks=50)

    def test_marks_within_limit_succeeds(self):
        mark = InternalMark.objects.create(
            student=self.student,
            subject=self.subject,
            assessment='IA1',
            marks=45.0,
            max_marks=50.0
        )
        self.assertEqual(mark.marks, 45.0)

    def test_marks_exceeding_max_marks_raises_validation_error(self):
        with self.assertRaises(ValidationError):
            InternalMark.objects.create(
                student=self.student,
                subject=self.subject,
                assessment='IA2',
                marks=55.0,
                max_marks=50.0
            )
