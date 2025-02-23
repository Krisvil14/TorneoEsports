import React from 'react';
import LoginLayout from '../component/layouts/LoginLayout';
import RegisterForm from '../component/login/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="container">
      <LoginLayout>
        <RegisterForm />
      </LoginLayout>
    </div>
  );
}
