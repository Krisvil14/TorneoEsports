import React from 'react';
import {
  getBackGroundColorClassName,
  getOptionalClassNames,
} from '../../utils/ui';
import '../../../styles/html/Container.css';

/**
 * Este componente se usa para crear containers como div que contendran elementos html dentro
 * @param {any} children el contenido
 * @param {string} bgColor para valores disponibles, revisar constants.js sección: background
 * @param {string} as debe ser una etiqueta html como por ejemplo div, section, main
 * @param {any} rest el resto de atributos de la etiqueta html que le desees asignar.
 * @returns
 */
export default function Container({
  children,
  bgColor,
  as: Component = 'div',
  ...rest
}) {
  const bgColorClassName = getBackGroundColorClassName(bgColor);
  const className = getOptionalClassNames([bgColorClassName, rest.className]);
  return (
    <Component {...rest} className={className}>
      {children}
    </Component>
  );
}
