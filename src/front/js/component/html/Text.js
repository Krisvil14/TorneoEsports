import React from 'react';
import {
  getTextColorClassName,
  getBackGroundColorClassName,
  getFontSizeClassName,
  getOptionalClassNames,
} from '../../utils/ui';
import '../../../styles/html/Text.css';

/**
 * Este componente se usa para crear etiquetas de tipo texto que pueden incluir por ejemplo <p></p> <a></a> <span></span> <label></label> etc...
 * @param {any} children el contenido
 * @param {string} bgColor color de fondo = "" | ""
 * @returns
 */
export default function Text({
  children,
  bgColor,
  textColor,
  fontSize,
  as: Component = 'p',
  ...rest
}) {
  const textColorClassName = getTextColorClassName(textColor);
  const bgColorClassName = getBackGroundColorClassName(bgColor);
  const fontSizeClassName = getFontSizeClassName(fontSize);
  const className = getOptionalClassNames([
    textColorClassName,
    bgColorClassName,
    fontSizeClassName,
    rest.className,
  ]);
  return (
    <Component {...rest} className={className}>
      {children}
    </Component>
  );
}
