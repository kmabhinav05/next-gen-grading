from rest_framework import serializers
from .models import Attendance

class AttendanceSerializer(serializers.ModelSerializer):
    student_reg_no = serializers.CharField(source='student.reg_no', read_only=True)
    student_name = serializers.CharField(source='student.user.get_full_name', read_only=True)
    subject_code = serializers.CharField(source='subject.code', read_only=True)
    subject_name = serializers.CharField(source='subject.name', read_only=True)
    percentage = serializers.FloatField(read_only=True)
    status_level = serializers.CharField(read_only=True)

    class Meta:
        model = Attendance
        fields = (
            'id', 'student', 'student_reg_no', 'student_name',
            'subject', 'subject_code', 'subject_name',
            'classes_held', 'classes_attended', 'percentage',
            'status_level', 'updated_at'
        )

    def validate(self, attrs):
        held = attrs.get('classes_held', getattr(self.instance, 'classes_held', 0))
        attended = attrs.get('classes_attended', getattr(self.instance, 'classes_attended', 0))
        if attended > held:
            raise serializers.ValidationError({"classes_attended": "Classes attended cannot exceed classes held."})
        return attrs
