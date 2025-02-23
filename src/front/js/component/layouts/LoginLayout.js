import React from 'react';
import '../../../styles/layout/login.css';

export default function LoginLayout({ children }) {
  return (
    <div className="row">
      <div className="col-8">{children}</div>
      <div className="col-4">
        <img
          alt="imagen de bienvenida"
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgoMy_EuXJ93jySOZdCAXh-ZlYiMEKnOgTwQ&s"
          className="w-100 h-100"
        />
      </div>
    </div>
  );
}
