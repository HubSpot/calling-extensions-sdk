import { DefaultTheme } from 'styled-components';
import { getContrastRatio } from './getContrastRatio';

//This ratio should be set to 4.5 once the theme is finalized
const MINIMUM_CONTRAST_RATIO = 3;

// Select accessible text from available text color options
export const getTextColorFromBgColor = (
  backgroundColor: string,
  theme: DefaultTheme
): string => {
  const accessibleText =
    getContrastRatio(backgroundColor, theme.primary) >= MINIMUM_CONTRAST_RATIO
      ? theme.primary
      : theme.textOnPrimary;
  const currentContrastRatio = getContrastRatio(
    backgroundColor,
    accessibleText
  );
  if (currentContrastRatio < MINIMUM_CONTRAST_RATIO) {
    // eslint-disable-next-line no-console
    console.error(
      `The current contrast ratio of ${currentContrastRatio}:1 does not meet the minimum contrast standards specified by the WCAG 2.0 (https://www.w3.org/TR/2008/REC-WCAG20-20081211/#visual-audio-contrast-contrast).`
    );
  }

  return accessibleText;
};
