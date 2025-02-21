import React from 'react';
import '../../../styles/layout/login.css';

export default function LoginLayout({ children }) {
  return (
    <div className="row">
      <div className="col-8">{children}</div>
      <div className="col-4">
        <img
          alt="imagen de bienvenida"
          src="https://ethic.es/wp-content/uploads/2023/03/imagen.jpg"
          className="w-100 h-100"
        />
      </div>
    </div>
  );
}
