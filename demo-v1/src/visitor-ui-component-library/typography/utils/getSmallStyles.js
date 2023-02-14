"use es6";

import { css } from "styled-components";

export const getSmallStyles = css`
  font-size: 12px;
  line-height: 18px;
`;

export const getGlobalSmallStyles = css`
  small {
    ${getSmallStyles}
  }
`;
