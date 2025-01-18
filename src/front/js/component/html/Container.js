import React from 'react';
import {
  getBackGroundColorClassName,
  getOptionalClassNames,
} from '../../utils/ui';
import '../../../styles/html/Container.css';

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
