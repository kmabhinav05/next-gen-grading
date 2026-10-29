from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from accounts.permissions import IsStudentRole
from .engine import process_student_query

class ChatbotMessageView(APIView):
    """
    Handles natural language queries from students about their attendance, marks, and study guidance.
    """
    permission_classes = [IsAuthenticated, IsStudentRole]

    def post(self, request):
        user = request.user
        if not hasattr(user, 'student_profile'):
            return Response({'error': 'Student profile not associated with this account.'}, status=status.HTTP_400_BAD_REQUEST)

        message = request.data.get('message', '').strip()
        if not message:
            return Response({'error': 'Message content cannot be empty.'}, status=status.HTTP_400_BAD_REQUEST)

        student = user.student_profile
        reply = process_student_query(student, message)

        return Response({
            'reply': reply,
            'student_reg_no': student.reg_no
        })
