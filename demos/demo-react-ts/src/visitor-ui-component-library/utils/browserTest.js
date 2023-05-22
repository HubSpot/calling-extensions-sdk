'use es6';

const lowercasedUserAgent = window.navigator
  ? navigator.userAgent.toLowerCase()
  : '';

export const isIE11 = () => lowercasedUserAgent.includes('trident/');
