"use es6";

import { css } from "styled-components";

const getH1Styles = css`
  font-weight: 700;
  font-size: 32px;
  line-height: 44px;
  margin-top: 0;
  margin-bottom: 16px;
`;

const getH2Styles = css`
  font-weight: 400;
  font-size: 24px;
  line-height: 30px;
  margin-top: 0;
  margin-bottom: 16px;
`;

const getH3Styles = css`
  font-weight: 700;
  font-size: 22px;
  line-height: 30px;
  margin-top: 0;
  margin-bottom: 16px;
`;

const getH4Styles = css`
  font-weight: 700;
  font-size: 18px;
  line-height: 26px;
  margin-top: 0;
  margin-bottom: 16px;
`;

const getH5Styles = css`
  font-weight: 400;
  font-size: 16px;
  line-height: 26px;
  margin-top: 0;
  margin-bottom: 16px;
`;

const getH6Styles = css`
  font-weight: 400;
  font-size: 14px;
  line-height: 24px;
  margin-top: 0;
  margin-bottom: 16px;
`;

export const getGlobalHeadingStyles = css`
  h1 {
    ${getH1Styles};
  }
  h2 {
    ${getH2Styles};
  }
  h3 {
    ${getH3Styles};
  }
  h4 {
    ${getH4Styles};
  }
  h5 {
    ${getH5Styles};
  }
  h6 {
    ${getH6Styles};
  }
`;
