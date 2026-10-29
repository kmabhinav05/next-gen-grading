from rest_framework import serializers
from .models import InternalMark, UploadLog

class InternalMarkSerializer(serializers.ModelSerializer):
    student_reg_no = serializers.CharField(source='student.reg_no', read_only=True)
    student_name = serializers.CharField(source='student.user.get_full_name', read_only=True)
    subject_code = serializers.CharField(source='subject.code', read_only=True)
    subject_name = serializers.CharField(source='subject.name', read_only=True)

    class Meta:
        model = InternalMark
        fields = (
            'id', 'student', 'student_reg_no', 'student_name',
            'subject', 'subject_code', 'subject_name',
            'assessment', 'marks', 'max_marks', 'updated_at'
        )


class UploadLogSerializer(serializers.ModelSerializer):
    subject_code = serializers.CharField(source='subject.code', read_only=True)
    subject_name = serializers.CharField(source='subject.name', read_only=True)
    staff_name = serializers.CharField(source='staff.user.get_full_name', read_only=True)

    class Meta:
        model = UploadLog
        fields = (
            'id', 'staff', 'staff_name', 'subject', 'subject_code',
            'subject_name', 'assessment', 'filename', 'status',
            'total_rows', 'valid_rows', 'invalid_rows', 'error_summary', 'timestamp'
        )
