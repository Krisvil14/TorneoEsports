import React, { useContext, useEffect } from 'react';
import LoginForm from '../component/login/LoginForm';
import { Context } from '../store/appContext';

export default function RegisterPage() {
  const { actions } = useContext(Context);

  useEffect(() => {
    actions.logout();
  }, []);

  return (
    <div className="container">
        <LoginForm />
    </div>
  );
}
