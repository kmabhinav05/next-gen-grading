from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

class SemesterResultsPlaceholderView(APIView):
    """
    Placeholder endpoint describing the future Controller of Examinations integration.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            'status': 'COMING_SOON',
            'title': 'Controller of Examinations Results Module',
            'description': 'Allows students to upload official university COE semester result PDFs. '
                           'The backend will parse tabular marks with pdfplumber and synthesize SGPA/CGPA '
                           'alongside internal assessment marks.',
            'pipeline_steps': [
                'Upload official Controller of Examinations PDF',
                'Server-side tabular extraction via pdfplumber',
                'Automated reconciliation with internal marks',
                'Comprehensive Consolidated Grade Card generation'
            ]
        })
