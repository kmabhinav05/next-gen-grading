from django.contrib import admin
from .models import InternalMark, UploadLog

@admin.register(InternalMark)
class InternalMarkAdmin(admin.ModelAdmin):
    list_display = ('student', 'subject', 'assessment', 'marks', 'max_marks', 'updated_at')
    list_filter = ('assessment', 'subject')
    search_fields = ('student__reg_no', 'student__user__first_name', 'subject__code')

@admin.register(UploadLog)
class UploadLogAdmin(admin.ModelAdmin):
    list_display = ('timestamp', 'subject', 'assessment', 'staff', 'status', 'valid_rows', 'total_rows')
    list_filter = ('status', 'assessment')
    search_fields = ('subject__code', 'filename', 'staff__user__username')
