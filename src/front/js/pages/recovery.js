import React from 'react';
import LoginLayout from '../component/layouts/LoginLayout';
import RecoveryForm from '../component/login/RecoveryForm';

export default function RegisterPage() {
  return (
    <div className="container">
      <LoginLayout>
        <RecoveryForm />
      </LoginLayout>
    </div>
  );
}
