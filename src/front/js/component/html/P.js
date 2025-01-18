import React from 'react';
import '../../../styles/html/P.css';

export default function P({ children, ...rest }) {
  return (
    <p {...rest} className={`p ${rest.className ?? ''}`}>
      {children}
    </p>
  );
}
