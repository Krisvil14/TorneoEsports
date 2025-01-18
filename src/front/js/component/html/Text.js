import React from 'react';
import {
  getTextColorClassName,
  getBackGroundColorClassName,
  getFontSizeClassName,
  getOptionalClassNames,
} from '../../utils/ui';
import '../../../styles/html/P.css';

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
