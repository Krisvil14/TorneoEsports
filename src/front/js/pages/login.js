import React, { useContext, useEffect } from 'react';
import LoginLayout from '../component/layouts/LoginLayout';
import LoginForm from '../component/login/LoginForm';
import { Context } from '../store/appContext';

export default function RegisterPage() {
  const { actions } = useContext(Context);

  useEffect(() => {
    actions.logout();
  }, []);

  return (
    <div className="container">
      <LoginLayout>
        <LoginForm />
      </LoginLayout>
    </div>
  );
}
