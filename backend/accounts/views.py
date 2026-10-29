from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import CustomTokenObtainPairSerializer, UserSerializer

class CustomTokenObtainPairView(TokenObtainPairView):
    """Logs in user and returns JWT tokens along with role and profile metadata."""
    serializer_class = CustomTokenObtainPairSerializer

class CurrentUserView(APIView):
    """Returns currently authenticated user profile and role details."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        user_info = serializer.data
        user_info['full_name'] = f"{user.first_name} {user.last_name}".strip() or user.username

        if user.role == 'STUDENT' and hasattr(user, 'student_profile'):
            student = user.student_profile
            user_info['student'] = {
                'id': student.id,
                'reg_no': student.reg_no,
                'department': student.department,
                'semester_id': student.semester_id,
                'semester_number': student.semester.number if student.semester else None,
                'section': student.section,
            }
        elif user.role == 'STAFF' and hasattr(user, 'staff_profile'):
            staff = user.staff_profile
            user_info['staff'] = {
                'id': staff.id,
                'department': staff.department,
            }
        elif user.role == 'PARENT' and hasattr(user, 'parent_profile'):
            parent = user.parent_profile
            user_info['parent'] = {
                'id': parent.id,
                'children': [
                    {
                        'id': link.student.id,
                        'name': f"{link.student.user.first_name} {link.student.user.last_name}".strip() or link.student.user.username,
                        'reg_no': link.student.reg_no,
                        'department': link.student.department,
                        'semester': link.student.semester.number if link.student.semester else None,
                        'section': link.student.section,
                    }
                    for link in parent.children.select_related('student__user', 'student__semester').all()
                ]
            }

        return Response(user_info)
