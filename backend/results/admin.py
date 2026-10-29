from django.contrib import admin
from .models import SemesterResult

@admin.register(SemesterResult)
class SemesterResultAdmin(admin.ModelAdmin):
    list_display = ('student', 'semester', 'sgpa', 'cgpa', 'is_processed', 'created_at')
