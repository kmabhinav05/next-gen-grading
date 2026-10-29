from django.urls import path
from .views import SemesterResultsPlaceholderView

urlpatterns = [
    path('info/', SemesterResultsPlaceholderView.as_view(), name='results_info'),
]
