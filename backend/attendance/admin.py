from django.contrib import admin
from .models import Attendance

@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    list_display = ('student', 'subject', 'classes_held', 'classes_attended', 'percentage', 'status_level')
    list_filter = ('subject', 'student__semester')
    search_fields = ('student__reg_no', 'student__user__first_name', 'subject__code')
