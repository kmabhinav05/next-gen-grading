import io
from django.db import models
from django.template.loader import render_to_string
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from xhtml2pdf import pisa
from pypdf import PdfWriter, PdfReader

from accounts.permissions import IsStaffOrAdmin, CanAccessStudentData
from academics.models import Student, Semester
from .generator import calculate_student_progress_card

class ProgressCardDetailView(APIView):
    """
    Returns structured progress card JSON for on-screen dashboard display.
    Enforces object-level permission so students only see themselves and parents see linked children.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, student_id):
        user = request.user

        # Access check
        if user.role == 'STUDENT':
            if not hasattr(user, 'student_profile') or user.student_profile.id != int(student_id):
                return Response({'error': 'Unauthorized. You can only view your own progress card.'}, status=status.HTTP_403_FORBIDDEN)
        elif user.role == 'PARENT':
            if not hasattr(user, 'parent_profile') or not user.parent_profile.children.filter(student_id=student_id).exists():
                return Response({'error': 'Unauthorized. You can only view your linked child\'s progress card.'}, status=status.HTTP_403_FORBIDDEN)
        elif user.role not in ['ADMIN', 'STAFF'] and not user.is_superuser:
            return Response({'error': 'Forbidden.'}, status=status.HTTP_403_FORBIDDEN)

        data = calculate_student_progress_card(student_id)
        if not data:
            return Response({'error': 'Student progress record not found.'}, status=status.HTTP_404_NOT_FOUND)

        return Response(data)


class ProgressCardPDFView(APIView):
    """
    Renders the student progress card as a styled, downloadable A4 PDF.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, student_id):
        user = request.user

        # Access check
        if user.role == 'STUDENT':
            if not hasattr(user, 'student_profile') or user.student_profile.id != int(student_id):
                return Response({'error': 'Unauthorized.'}, status=status.HTTP_403_FORBIDDEN)
        elif user.role == 'PARENT':
            if not hasattr(user, 'parent_profile') or not user.parent_profile.children.filter(student_id=student_id).exists():
                return Response({'error': 'Unauthorized.'}, status=status.HTTP_403_FORBIDDEN)
        elif user.role not in ['ADMIN', 'STAFF'] and not user.is_superuser:
            return Response({'error': 'Forbidden.'}, status=status.HTTP_403_FORBIDDEN)

        data = calculate_student_progress_card(student_id)
        if not data:
            return Response({'error': 'Student progress record not found.'}, status=status.HTTP_404_NOT_FOUND)

        html_string = render_to_string('progress_card_pdf.html', data)
        pdf_file = io.BytesIO()
        pisa_status = pisa.CreatePDF(html_string, dest=pdf_file)

        if pisa_status.err:
            return Response({'error': 'PDF generation failed.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        pdf_file.seek(0)
        filename = f"ProgressCard_{data['student']['reg_no']}.pdf"
        response = HttpResponse(pdf_file.getvalue(), content_type='application/pdf')
        response['Content-Disposition'] = f'inline; filename="{filename}"'
        return response


class ClassReportListView(APIView):
    """
    Returns aggregated class progress list for Staff and Admin:
    searchable by register number/name and filterable by semester/section.
    """
    permission_classes = [IsStaffOrAdmin]

    def get(self, request):
        semester_id = request.query_params.get('semester')
        section = request.query_params.get('section', 'A')
        search = request.query_params.get('search', '').strip().lower()

        students_qs = Student.objects.select_related('user', 'semester')
        if semester_id:
            students_qs = students_qs.filter(semester_id=semester_id)
        if section:
            students_qs = students_qs.filter(section=section)

        if search:
            students_qs = students_qs.filter(
                models.Q(reg_no__icontains=search) |
                models.Q(user__first_name__icontains=search) |
                models.Q(user__last_name__icontains=search)
            )

        results = []
        for s in students_qs.order_by('reg_no'):
            card = calculate_student_progress_card(s.id)
            if card:
                results.append({
                    'id': s.id,
                    'reg_no': s.reg_no,
                    'name': s.user.get_full_name() or s.user.username,
                    'semester': s.semester.number if s.semester else None,
                    'section': s.section,
                    'overall_marks_percentage': card['summary']['overall_marks_percentage'],
                    'overall_attendance_percentage': card['summary']['overall_attendance_percentage'],
                    'overall_attendance_status': card['summary']['overall_attendance_status'],
                    'weak_subjects_count': len(card['summary']['weak_subjects']),
                })

        return Response(results)


class BulkPDFExportView(APIView):
    """
    Merges all student progress card PDFs for a given semester and section into one combined document.
    """
    permission_classes = [IsStaffOrAdmin]

    def post(self, request):
        semester_id = request.data.get('semester_id')
        section = request.data.get('section', 'A')

        if not semester_id:
            return Response({'error': 'semester_id is required.'}, status=status.HTTP_400_BAD_REQUEST)

        students = Student.objects.filter(semester_id=semester_id, section=section).order_by('reg_no')
        if not students.exists():
            return Response({'error': 'No students found for this class.'}, status=status.HTTP_404_NOT_FOUND)

        merger = PdfWriter()

        for s in students:
            card_data = calculate_student_progress_card(s.id)
            if not card_data:
                continue

            html_str = render_to_string('progress_card_pdf.html', card_data)
            pdf_buf = io.BytesIO()
            pisa.CreatePDF(html_str, dest=pdf_buf)
            pdf_buf.seek(0)
            merger.append(pdf_buf)

        output_pdf = io.BytesIO()
        merger.write(output_pdf)
        output_pdf.seek(0)

        filename = f"Class_Progress_Cards_Sem{semester_id}_Sec{section}.pdf"
        response = HttpResponse(output_pdf.getvalue(), content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="{filename}"'
        return response
