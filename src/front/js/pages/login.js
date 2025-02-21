import React from 'react';
import LoginLayout from '../component/layouts/LoginLayout';
import LoginForm from '../component/login/LoginForm';

export default function LoginPage() {
  return (
    <div className="container">
      <LoginLayout>
        <LoginForm />
      </LoginLayout>
    </div>
  );
}
