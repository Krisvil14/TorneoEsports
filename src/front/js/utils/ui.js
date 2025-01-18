export function getTextColorClassName(color) {
  switch (color) {
    // primary
    case 'primary':
      return 'primary-text-color';
    case 'primary-100':
      return 'primary-text-color-100';
    case 'primary-200':
      return 'primary-text-color-200';
    case 'primary-300':
      return 'primary-text-color-300';
    // secondary
    case 'secondary':
      return 'secondary-text-color';
    case 'secondary-100':
      return 'secondary-text-color-100';
    case 'secondary-200':
      return 'secondary-text-color-200';
    case 'secondary-300':
      return 'secondary-text-color-300';
    // ternary
    case 'ternary':
      return 'ternary-text-color';
    case 'ternary-100':
      return 'ternary-text-color-100';
    case 'ternary-200':
      return 'ternary-text-color-200';
    case 'ternary-300':
      return 'ternary-text-color-300';
    // rest
    case 'danger':
      return 'danger-text-color';
    case 'warning':
      return 'warning-text-color';
    case 'success':
      return 'success-text-color';
    // default is primary text
    default:
      return null;
  }
}

export function getBackGroundColorClassName(color) {
  switch (color) {
    case 'primary':
      return 'primary-bg-color';
    case 'secondary':
      return 'secondary-bg-color';
    case 'ternary':
      return 'ternary-bg-color';
    default:
      return null;
  }
}

export function getFontSizeClassName(size) {
  switch (size) {
    case 'sm':
      return 'font-sm';
    case 'md':
      return 'font-md';
    case 'lg':
      return 'font-lg';
    case 'xlg':
      return 'font-xlg';
    case '2xlg':
      return 'font-2xlg';
    case '3xlg':
      return 'font-3xlg';
    default:
      return null;
  }
}

/**
 * Retorna un string con todas las clases que hayas introducido
 * @param {string[]} classNamesArray un areglo de strings
 * @returns
 */
export function getOptionalClassNames(classNamesArray) {
  let classNames = '';
  if (!classNamesArray || !Array.isArray(classNamesArray)) {
    return classNames;
  }
  // iterate array
  classNamesArray.forEach((className, index) => {
    if (className && className !== '') {
      classNames += `${className} `;
    }
  });
  return classNames;
}
