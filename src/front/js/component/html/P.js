import React from 'react';
import {
  getTextColorClassName,
  getBackGroundColorClassName,
  getOptionalClassNames,
} from '../../utils/ui';
import '../../../styles/html/P.css';

export default function P({ children, bgColor, textColor, ...rest }) {
  const textColorClassName = getTextColorClassName(textColor);
  const bgColorClassName = getBackGroundColorClassName(bgColor);
  const className = getOptionalClassNames([
    textColorClassName,
    bgColorClassName,
    rest.className,
  ]);
  return (
    <p {...rest} className={className}>
      {children}
    </p>
  );
}
