import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Component as SignInCard2 } from '@/components/ui/sign-in-card-2';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const redirectByRole = (role) => {
    switch (role) {
      case 'ADMIN':
        navigate('/admin/dashboard');
        break;
      case 'STAFF':
        navigate('/staff/dashboard');
        break;
      case 'STUDENT':
        navigate('/student/dashboard');
        break;
      case 'PARENT':
        navigate('/parent/dashboard');
        break;
      default:
        navigate('/');
    }
  };

  const handleLoginSubmit = async ({ email, password }) => {
    try {
      const user = await login(email, password);
      if (user?.role) {
        redirectByRole(user.role);
      }
    } catch (err) {
      // Handled in AuthContext
    }
  };

  const handleRoleQuickSelect = async (role) => {
    const credentials = {
      ADMIN: { u: 'admin', p: 'admin123' },
      STAFF: { u: 'staff1', p: 'staff123' },
      STUDENT: { u: '21CS001', p: 'student123' },
      PARENT: { u: 'parent1', p: 'parent123' }
    };
    const cred = credentials[role];
    if (cred) {
      try {
        const user = await login(cred.u, cred.p);
        redirectByRole(user.role);
      } catch (err) {}
    }
  };

  return (
    <SignInCard2
      brandTitle="Next Gen Grading"
      brandSubtitle="Sign in to access your Academic Portal"
      onLoginSubmit={handleLoginSubmit}
      onRoleQuickSelect={handleRoleQuickSelect}
    />
  );
};

export default Login;
