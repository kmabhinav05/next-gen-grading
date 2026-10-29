from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db import transaction
from accounts.permissions import IsStaffOrAdmin
from academics.models import Subject, Student
from .models import Attendance
from .serializers import AttendanceSerializer

class AttendanceListView(generics.ListAPIView):
    """Lists attendance records with filters for subject, semester, and section."""
    serializer_class = AttendanceSerializer
    permission_classes = [IsStaffOrAdmin]
    pagination_class = None

    def get_queryset(self):
        qs = Attendance.objects.select_related('student__user', 'student__semester', 'subject').all()
        subject_id = self.request.query_params.get('subject_id')
        semester_id = self.request.query_params.get('semester')
        section = self.request.query_params.get('section')
        student_id = self.request.query_params.get('student_id')

        if subject_id:
            qs = qs.filter(subject_id=subject_id)
        if semester_id:
            qs = qs.filter(student__semester_id=semester_id)
        if section:
            qs = qs.filter(student__section=section)
        if student_id:
            qs = qs.filter(student_id=student_id)

        return qs


class AttendanceBulkUpdateView(APIView):
    """
    Allows staff to enter or update attendance numbers for multiple students in a subject at once.
    """
    permission_classes = [IsStaffOrAdmin]

    def post(self, request):
        subject_id = request.data.get('subject_id')
        records = request.data.get('records', [])

        if not subject_id or not isinstance(records, list):
            return Response({'error': 'subject_id and a list of records are required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            subject = Subject.objects.get(id=subject_id)
        except Subject.DoesNotExist:
            return Response({'error': 'Subject not found.'}, status=status.HTTP_404_NOT_FOUND)

        updated_count = 0
        errors = []

        with transaction.atomic():
            for idx, item in enumerate(records):
                student_id = item.get('student_id')
                classes_held = item.get('classes_held', 0)
                classes_attended = item.get('classes_attended', 0)

                try:
                    held = int(classes_held)
                    attended = int(classes_attended)
                    if attended > held:
                        errors.append(f"Row {idx+1}: Attended ({attended}) exceeds held ({held}).")
                        continue
                    if held < 0 or attended < 0:
                        errors.append(f"Row {idx+1}: Values cannot be negative.")
                        continue

                    Attendance.objects.update_or_create(
                        student_id=student_id,
                        subject=subject,
                        defaults={
                            'classes_held': held,
                            'classes_attended': attended
                        }
                    )
                    updated_count += 1
                except Exception as e:
                    errors.append(f"Row {idx+1}: {str(e)}")

        if errors:
            return Response({
                'message': f"Updated {updated_count} records with some errors.",
                'updated_count': updated_count,
                'errors': errors
            }, status=status.HTTP_207_MULTI_STATUS if updated_count > 0 else status.HTTP_400_BAD_REQUEST)

        return Response({
            'message': f"Successfully updated attendance for {updated_count} students.",
            'updated_count': updated_count
        }, status=status.HTTP_200_OK)
