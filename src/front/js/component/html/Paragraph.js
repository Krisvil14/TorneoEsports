import React from 'react';
import {
  getTextColorClassName,
  getBackGroundColorClassName,
  getFontSizeClassName,
  getOptionalClassNames,
} from '../../utils/ui';
import '../../../styles/html/P.css';

export default function Paragraph({
  children,
  bgColor,
  textColor,
  fontSize,
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
    <p {...rest} className={className}>
      {children}
    </p>
  );
}
