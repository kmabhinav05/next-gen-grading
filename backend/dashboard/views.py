from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from accounts.models import User
from academics.models import Student, Staff, Subject, Semester, Parent
from marks.models import InternalMark, UploadLog
from attendance.models import Attendance
from reports.generator import calculate_student_progress_card

class DashboardStatsView(APIView):
    """
    Returns role-tailored dashboard metrics and analytics.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        role = user.role

        if role == 'ADMIN' or user.is_superuser:
            total_students = Student.objects.count()
            total_staff = Staff.objects.count()
            total_subjects = Subject.objects.count()
            total_semesters = Semester.objects.count()

            recent_logs = UploadLog.objects.select_related('staff__user', 'subject')[:5]
            logs_data = [
                {
                    'id': l.id,
                    'subject_code': l.subject.code,
                    'assessment': l.assessment,
                    'staff_name': l.staff.user.get_full_name() if l.staff else 'System',
                    'status': l.status,
                    'valid_rows': l.valid_rows,
                    'timestamp': l.timestamp.strftime('%d %b %Y, %I:%M %p')
                }
                for l in recent_logs
            ]

            # Critical attendance tally
            critical_attendance_count = Attendance.objects.filter(classes_held__gt=0).extra(
                where=["(classes_attended / classes_held) < 0.75"]
            ).count()

            return Response({
                'role': 'ADMIN',
                'counts': {
                    'students': total_students,
                    'staff': total_staff,
                    'subjects': total_subjects,
                    'semesters': total_semesters,
                    'critical_attendance_records': critical_attendance_count,
                },
                'recent_uploads': logs_data,
            })

        elif role == 'STAFF':
            staff_profile = getattr(user, 'staff_profile', None)
            if not staff_profile:
                return Response({'role': 'STAFF', 'assigned_subjects': [], 'message': 'Staff profile missing'})

            assigned = staff_profile.assigned_subjects.select_related('semester').all()
            subjects_data = []

            for s in assigned:
                enrolled_students = Student.objects.filter(semester=s.semester).count()
                ia1_count = InternalMark.objects.filter(subject=s, assessment='IA1').count()
                ia2_count = InternalMark.objects.filter(subject=s, assessment='IA2').count()
                ia3_count = InternalMark.objects.filter(subject=s, assessment='IA3').count()

                subjects_data.append({
                    'id': s.id,
                    'code': s.code,
                    'name': s.name,
                    'semester': s.semester.number,
                    'enrolled_students': enrolled_students,
                    'marks_status': {
                        'IA1': 'Completed' if ia1_count >= enrolled_students and enrolled_students > 0 else f"{ia1_count}/{enrolled_students}",
                        'IA2': 'Completed' if ia2_count >= enrolled_students and enrolled_students > 0 else f"{ia2_count}/{enrolled_students}",
                        'IA3': 'Completed' if ia3_count >= enrolled_students and enrolled_students > 0 else f"{ia3_count}/{enrolled_students}",
                    }
                })

            recent_logs = UploadLog.objects.filter(staff=staff_profile)[:5]
            logs_data = [
                {
                    'id': l.id,
                    'subject_code': l.subject.code,
                    'assessment': l.assessment,
                    'status': l.status,
                    'valid_rows': l.valid_rows,
                    'timestamp': l.timestamp.strftime('%d %b, %H:%M')
                }
                for l in recent_logs
            ]

            return Response({
                'role': 'STAFF',
                'staff_name': user.get_full_name() or user.username,
                'department': staff_profile.department,
                'assigned_subjects': subjects_data,
                'recent_logs': logs_data,
            })

        elif role == 'STUDENT':
            student = getattr(user, 'student_profile', None)
            if not student:
                return Response({'role': 'STUDENT', 'message': 'No student profile'})

            card = calculate_student_progress_card(student.id)
            return Response({
                'role': 'STUDENT',
                'progress_card': card
            })

        elif role == 'PARENT':
            parent = getattr(user, 'parent_profile', None)
            if not parent:
                return Response({'role': 'PARENT', 'message': 'No parent profile'})

            children_data = []
            for link in parent.children.select_related('student__user', 'student__semester').all():
                child_card = calculate_student_progress_card(link.student.id)
                children_data.append(child_card)

            return Response({
                'role': 'PARENT',
                'children': children_data
            })

        return Response({'role': role})
