export const TEXT_COLOR_PRIMARY = 'primary';
export const TEXT_COLOR_PRIMARY_100 = 'primary-100';
export const TEXT_COLOR_PRIMARY_200 = 'primary-200';
export const TEXT_COLOR_PRIMARY_300 = 'primary-300';
export const TEXT_COLOR_SECONDARY = 'secondary';
export const TEXT_COLOR_SECONDARY_100 = 'secondary-100';
export const TEXT_COLOR_SECONDARY_200 = 'secondary-200';
export const TEXT_COLOR_SECONDARY_300 = 'secondary-300';
export const TEXT_COLOR_TERNARY = 'ternary';
export const TEXT_COLOR_TERNARY_100 = 'ternary-100';
export const TEXT_COLOR_TERNARY_200 = 'ternary-200';
export const TEXT_COLOR_TERNARY_300 = 'ternary-300';

export function getTextColorClassName(color) {
  switch (color) {
    // primary
    case TEXT_COLOR_PRIMARY:
      return 'primary-text-color';
    case TEXT_COLOR_PRIMARY_100:
      return 'primary-text-color-100';
    case TEXT_COLOR_PRIMARY_200:
      return 'primary-text-color-200';
    case TEXT_COLOR_PRIMARY_300:
      return 'primary-text-color-300';
    // secondary
    case TEXT_COLOR_SECONDARY:
      return 'secondary-text-color';
    case TEXT_COLOR_SECONDARY_100:
      return 'secondary-text-color-100';
    case TEXT_COLOR_SECONDARY_200:
      return 'secondary-text-color-200';
    case TEXT_COLOR_SECONDARY_300:
      return 'secondary-text-color-300';
    // ternary
    case TEXT_COLOR_TERNARY:
      return 'ternary-text-color';
    case TEXT_COLOR_TERNARY_100:
      return 'ternary-text-color-100';
    case TEXT_COLOR_TERNARY_200:
      return 'ternary-text-color-200';
    case TEXT_COLOR_TERNARY_300:
      return 'ternary-text-color-300';
    default:
      return '';
  }
}

export const BACKGROUND_COLOR_PRIMARY = 'primary-bg';
export const BACKGROUND_COLOR_SECONDARY = 'secondary-bg';
export const BACKGROUND_COLOR_TERNARY = 'ternary-bg';

export function getBackGroundColorClassName(color) {
  switch (color) {
    case BACKGROUND_COLOR_PRIMARY:
      return 'primary-background-color';
    case BACKGROUND_COLOR_SECONDARY:
      return 'secondary-background-color';
    case BACKGROUND_COLOR_TERNARY:
      return 'ternary-background-color';
    default:
      return '';
  }
}

export const FONT_SIZE_SM = 'sm';
export const FONT_SIZE_MD = 'md';
export const FONT_SIZE_LG = 'lg';
export const FONT_SIZE_XLG = 'xlg';
export const FONT_SIZE_2XLG = '2xlg';
export const FONT_SIZE_3XLG = '3xlg';

export function getFontSizeClassName(size) {
  switch (size) {
    case FONT_SIZE_SM:
      return 'font-sm';
    case FONT_SIZE_MD:
      return 'font-md';
    case FONT_SIZE_LG:
      return 'font-lg';
    case FONT_SIZE_XLG:
      return 'font-xlg';
    case FONT_SIZE_2XLG:
      return 'font-2xlg';
    case FONT_SIZE_3XLG:
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
