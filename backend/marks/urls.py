from django.urls import path
from .views import (
    MarksTemplateDownloadView,
    MarksUploadPreviewView,
    MarksUploadConfirmView,
    UploadLogListView
)

urlpatterns = [
    path('template/', MarksTemplateDownloadView.as_view(), name='marks_template'),
    path('upload-preview/', MarksUploadPreviewView.as_view(), name='marks_upload_preview'),
    path('upload-confirm/', MarksUploadConfirmView.as_view(), name='marks_upload_confirm'),
    path('logs/', UploadLogListView.as_view(), name='marks_upload_logs'),
]
