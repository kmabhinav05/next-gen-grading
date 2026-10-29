from django.test import TestCase
from django.contrib.auth import get_user_model
from academics.models import Semester, Student, Subject
from marks.models import InternalMark
from attendance.models import Attendance
from reports.generator import calculate_student_progress_card

User = get_user_model()

class ReportsCalculationTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='stu_rep', password='password123', role='STUDENT')
        self.sem = Semester.objects.create(number=5, academic_year='2026-2027')
        self.student = Student.objects.create(user=self.user, reg_no='21REP001', semester=self.sem)
        self.subject = Subject.objects.create(code='CS777', name='Cloud Computing', semester=self.sem, max_internal_marks=50)

        InternalMark.objects.create(student=self.student, subject=self.subject, assessment='IA1', marks=40.0, max_marks=50.0)
        InternalMark.objects.create(student=self.student, subject=self.subject, assessment='IA2', marks=44.0, max_marks=50.0)
        Attendance.objects.create(student=self.student, subject=self.subject, classes_held=40, classes_attended=36)

    def test_progress_card_calculation(self):
        card = calculate_student_progress_card(self.student.id)
        self.assertIsNotNone(card)
        self.assertEqual(card['student']['reg_no'], '21REP001')
        self.assertEqual(len(card['subjects']), 1)
        subj_data = card['subjects'][0]
        self.assertEqual(subj_data['average'], 42.0)
        self.assertEqual(subj_data['attendance_percentage'], 90.0)
        self.assertIn('Distinction' in card['summary']['remarks'] or 'Good' in card['summary']['remarks'], [True, True])
