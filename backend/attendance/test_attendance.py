from django.test import TestCase
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model
from academics.models import Semester, Student, Subject
from attendance.models import Attendance

User = get_user_model()

class AttendanceTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='stu_att', password='password123', role='STUDENT')
        self.sem = Semester.objects.create(number=5, academic_year='2026-2027')
        self.student = Student.objects.create(user=self.user, reg_no='21TEST002', semester=self.sem)
        self.subject = Subject.objects.create(code='CS888', name='Test Course 2', semester=self.sem)

    def test_attendance_percentage_and_status(self):
        # 36 out of 40 = 90% (NORMAL)
        att = Attendance.objects.create(
            student=self.student,
            subject=self.subject,
            classes_held=40,
            classes_attended=36
        )
        self.assertEqual(att.percentage, 90.0)
        self.assertEqual(att.status_level, 'NORMAL')

        # 26 out of 40 = 65% (CRITICAL)
        att.classes_attended = 26
        att.save()
        self.assertEqual(att.percentage, 65.0)
        self.assertEqual(att.status_level, 'CRITICAL')

    def test_attended_greater_than_held_raises_error(self):
        with self.assertRaises(ValidationError):
            Attendance.objects.create(
                student=self.student,
                subject=self.subject,
                classes_held=30,
                classes_attended=35
            )
