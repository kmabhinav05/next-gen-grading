from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

User = get_user_model()

class AccountsAuthTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin_user = User.objects.create_superuser(
            username='test_admin', password='password123', role='ADMIN'
        )
        self.staff_user = User.objects.create_user(
            username='test_staff', password='password123', role='STAFF'
        )
        self.student_user = User.objects.create_user(
            username='test_student', password='password123', role='STUDENT'
        )

    def test_login_returns_jwt_and_role(self):
        response = self.client.post('/api/auth/login/', {
            'username': 'test_admin',
            'password': 'password123'
        })
        self.assertEqual(response.status_code, 200)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.assertEqual(response.data['user']['role'], 'ADMIN')

    def test_invalid_login_rejected(self):
        response = self.client.post('/api/auth/login/', {
            'username': 'test_admin',
            'password': 'wrongpassword'
        })
        self.assertEqual(response.status_code, 401)
