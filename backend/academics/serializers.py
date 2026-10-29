from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Semester, Staff, Student, Parent, ParentStudent, Subject

User = get_user_model()

class SemesterSerializer(serializers.ModelSerializer):
    student_count = serializers.IntegerField(source='students.count', read_only=True)
    subject_count = serializers.IntegerField(source='subjects.count', read_only=True)

    class Meta:
        model = Semester
        fields = ('id', 'number', 'academic_year', 'student_count', 'subject_count')


class StaffSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username')
    email = serializers.EmailField(source='user.email')
    first_name = serializers.CharField(source='user.first_name')
    last_name = serializers.CharField(source='user.last_name')
    phone_number = serializers.CharField(source='user.phone_number', required=False, allow_blank=True)
    password = serializers.CharField(write_only=True, required=False)
    assigned_subject_count = serializers.IntegerField(source='assigned_subjects.count', read_only=True)

    class Meta:
        model = Staff
        fields = (
            'id', 'user_id', 'username', 'email', 'first_name', 'last_name',
            'phone_number', 'department', 'designation', 'assigned_subject_count', 'password'
        )
        read_only_fields = ('id', 'user_id')

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        password = validated_data.pop('password', 'staff123')
        user = User.objects.create_user(
            username=user_data['username'],
            email=user_data.get('email', ''),
            first_name=user_data.get('first_name', ''),
            last_name=user_data.get('last_name', ''),
            phone_number=user_data.get('phone_number', ''),
            role='STAFF',
            password=password
        )
        staff = Staff.objects.create(user=user, **validated_data)
        return staff

    def update(self, instance, validated_data):
        if 'user' in validated_data:
            user_data = validated_data.pop('user')
            user = instance.user
            for attr, val in user_data.items():
                setattr(user, attr, val)
            if 'password' in validated_data:
                user.set_password(validated_data.pop('password'))
            user.save()
        return super().update(instance, validated_data)


class StudentSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username')
    email = serializers.EmailField(source='user.email', required=False, allow_blank=True)
    first_name = serializers.CharField(source='user.first_name')
    last_name = serializers.CharField(source='user.last_name', required=False, allow_blank=True)
    full_name = serializers.SerializerMethodField()
    phone_number = serializers.CharField(source='user.phone_number', required=False, allow_blank=True)
    password = serializers.CharField(write_only=True, required=False)
    semester_number = serializers.IntegerField(source='semester.number', read_only=True)
    academic_year = serializers.CharField(source='semester.academic_year', read_only=True)

    class Meta:
        model = Student
        fields = (
            'id', 'user_id', 'username', 'email', 'first_name', 'last_name', 'full_name',
            'phone_number', 'reg_no', 'department', 'semester', 'semester_number',
            'academic_year', 'section', 'password'
        )
        read_only_fields = ('id', 'user_id')

    def get_full_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}".strip() or obj.user.username

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        password = validated_data.pop('password', 'student123')
        user = User.objects.create_user(
            username=user_data['username'],
            email=user_data.get('email', ''),
            first_name=user_data.get('first_name', ''),
            last_name=user_data.get('last_name', ''),
            phone_number=user_data.get('phone_number', ''),
            role='STUDENT',
            password=password
        )
        student = Student.objects.create(user=user, **validated_data)
        return student

    def update(self, instance, validated_data):
        if 'user' in validated_data:
            user_data = validated_data.pop('user')
            user = instance.user
            for attr, val in user_data.items():
                setattr(user, attr, val)
            if 'password' in validated_data:
                user.set_password(validated_data.pop('password'))
            user.save()
        return super().update(instance, validated_data)


class ParentSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username')
    email = serializers.EmailField(source='user.email', required=False, allow_blank=True)
    first_name = serializers.CharField(source='user.first_name')
    last_name = serializers.CharField(source='user.last_name', required=False, allow_blank=True)
    phone_number = serializers.CharField(source='user.phone_number', required=False, allow_blank=True)
    password = serializers.CharField(write_only=True, required=False)
    linked_children = serializers.SerializerMethodField()

    class Meta:
        model = Parent
        fields = (
            'id', 'user_id', 'username', 'email', 'first_name', 'last_name',
            'phone_number', 'relationship', 'linked_children', 'password'
        )
        read_only_fields = ('id', 'user_id')

    def get_linked_children(self, obj):
        return [
            {
                'id': link.student.id,
                'reg_no': link.student.reg_no,
                'name': link.student.user.get_full_name() or link.student.user.username,
                'semester': link.student.semester.number if link.student.semester else None,
                'section': link.student.section,
            }
            for link in obj.children.select_related('student__user', 'student__semester').all()
        ]

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        password = validated_data.pop('password', 'parent123')
        user = User.objects.create_user(
            username=user_data['username'],
            email=user_data.get('email', ''),
            first_name=user_data.get('first_name', ''),
            last_name=user_data.get('last_name', ''),
            phone_number=user_data.get('phone_number', ''),
            role='PARENT',
            password=password
        )
        parent = Parent.objects.create(user=user, **validated_data)
        return parent


class ParentStudentSerializer(serializers.ModelSerializer):
    parent_name = serializers.CharField(source='parent.user.get_full_name', read_only=True)
    student_name = serializers.CharField(source='student.user.get_full_name', read_only=True)
    student_reg_no = serializers.CharField(source='student.reg_no', read_only=True)

    class Meta:
        model = ParentStudent
        fields = ('id', 'parent', 'student', 'parent_name', 'student_name', 'student_reg_no', 'created_at')


class SubjectSerializer(serializers.ModelSerializer):
    semester_number = serializers.IntegerField(source='semester.number', read_only=True)
    staff_name = serializers.CharField(source='staff.user.get_full_name', read_only=True)

    class Meta:
        model = Subject
        fields = (
            'id', 'code', 'name', 'semester', 'semester_number',
            'staff', 'staff_name', 'max_internal_marks'
        )
