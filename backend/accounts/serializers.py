from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'role', 'phone_number')
        read_only_fields = ('id',)

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['role'] = user.role
        token['username'] = user.username
        token['full_name'] = f"{user.first_name} {user.last_name}".strip() or user.username
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        user = self.user
        
        user_info = {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'full_name': f"{user.first_name} {user.last_name}".strip() or user.username,
            'role': user.role,
            'phone_number': user.phone_number,
        }

        # Role-specific contextual details
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

        data['user'] = user_info
        return data
