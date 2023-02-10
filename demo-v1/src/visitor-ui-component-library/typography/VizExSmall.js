"use es6";

import styled, { css } from "styled-components";
import {
  getErrorTextColor,
  getHelpTextColor,
} from "../theme/defaultThemeOperators";
import { ERROR, HELP, DEFAULT } from "./constants/SmallVariations";
import { getSmallStyles } from "./utils/getSmallStyles";

const getVariationStyles = ({ use, theme }) => {
  switch (use) {
    case ERROR:
      return css`
        color: ${getErrorTextColor(theme)};
      `;
    case HELP:
      return css`
        color: ${getHelpTextColor(theme)};
      `;
    case DEFAULT:
    default:
      return null;
  }
};

const VizExSmall = styled.small`
  display: block;
  ${getSmallStyles};
  ${getVariationStyles};
`;

export default VizExSmall;
