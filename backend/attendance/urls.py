from django.urls import path
from .views import AttendanceListView, AttendanceBulkUpdateView

urlpatterns = [
    path('', AttendanceListView.as_view(), name='attendance_list'),
    path('bulk-update/', AttendanceBulkUpdateView.as_view(), name='attendance_bulk_update'),
]
