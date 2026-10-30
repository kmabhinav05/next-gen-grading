import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Component as SignInCard2 } from '@/components/ui/sign-in-card-2';
import toast from 'react-hot-toast';

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
      const cleanInput = (email || '').trim();
      const mappedUser =
        cleanInput.toLowerCase() === '21cs001' || cleanInput.toLowerCase() === 'student'
          ? 'student1'
          : cleanInput;
      const user = await login(mappedUser, password);
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
      STAFF: { u: 'staff_sharma', p: 'staff123' },
      STUDENT: { u: 'student1', p: 'student123' },
      PARENT: { u: 'parent_patel', p: 'parent123' }
    };
    const cred = credentials[role];
    if (cred) {
      try {
        const user = await login(cred.u, cred.p);
        if (user?.role) {
          redirectByRole(user.role);
        } else {
          redirectByRole(role);
        }
      } catch (err) {
        console.error('Quick login error:', err);
        // Fallback direct role navigation for demonstration resilience
        redirectByRole(role);
      }
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
