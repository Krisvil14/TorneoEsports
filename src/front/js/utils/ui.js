import {
  TEXT_COLOR_PRIMARY,
  TEXT_COLOR_PRIMARY_100,
  TEXT_COLOR_PRIMARY_200,
  TEXT_COLOR_PRIMARY_300,
  TEXT_COLOR_SECONDARY,
  TEXT_COLOR_SECONDARY_100,
  TEXT_COLOR_SECONDARY_200,
  TEXT_COLOR_SECONDARY_300,
  TEXT_COLOR_TERNARY,
  TEXT_COLOR_TERNARY_100,
  TEXT_COLOR_TERNARY_200,
  TEXT_COLOR_TERNARY_300,
  BACKGROUND_COLOR_PRIMARY,
  BACKGROUND_COLOR_SECONDARY,
  BACKGROUND_COLOR_TERNARY,
  FONT_SIZE_SM,
  FONT_SIZE_MD,
  FONT_SIZE_LG,
  FONT_SIZE_XLG,
  FONT_SIZE_2XLG,
  FONT_SIZE_3XLG,
} from './constants';

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
