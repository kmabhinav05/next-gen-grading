from django.urls import path
from .views import (
    ProgressCardDetailView,
    ProgressCardPDFView,
    ClassReportListView,
    BulkPDFExportView
)

urlpatterns = [
    path('progress-card/<int:student_id>/', ProgressCardDetailView.as_view(), name='progress_card_detail'),
    path('progress-card/<int:student_id>/pdf/', ProgressCardPDFView.as_view(), name='progress_card_pdf'),
    path('class/', ClassReportListView.as_view(), name='class_report_list'),
    path('bulk-pdf/', BulkPDFExportView.as_view(), name='bulk_pdf_export'),
]
