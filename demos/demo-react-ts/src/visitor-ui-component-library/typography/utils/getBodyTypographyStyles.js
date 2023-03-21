"use es6";

import { css } from "styled-components";
import { getTextColor } from "../../theme/defaultThemeOperators";

export const getBodyTypographyStyles = ({ theme }) => css`
  font-family: Helvetica, Arial, sans-serif;
  font-weight: 400;
  font-size: 14px;
  color: ${getTextColor(theme)};
  line-height: 24px;
`;
