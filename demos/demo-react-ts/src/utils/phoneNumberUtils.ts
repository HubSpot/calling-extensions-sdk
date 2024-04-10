export const PHONE_NUMBER_ONE = "+16179483986";
export const PHONE_NUMBER_TWO = "+442073238299";
export const FORMATTED_PHONE_NUMBER_ONE = "+1 617-948-3986";
export const FORMATTED_PHONE_NUMBER_TWO = "+44 20 7323 8299";

export const PHONE_NUMBERS_MAP = {
  [PHONE_NUMBER_ONE]: FORMATTED_PHONE_NUMBER_ONE,
  [PHONE_NUMBER_TWO]: FORMATTED_PHONE_NUMBER_TWO,
};

export type PhoneNumber = typeof PHONE_NUMBER_ONE | typeof PHONE_NUMBER_TWO;

export const validateKeypadInput = (value: string) => {
  return /^[0-9+*#]*$/.test(value);
};

export const validatePhoneNumber = (value: string) => {
  return value.length > 2;
};

export const normalizePhoneNumber = (phoneNumberString: string): string => {
  const cleaned = `${phoneNumberString}`.replace(/\D/g, "");
  const match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    const intlCode = match[1] ? "+1 " : "";
    return [intlCode, "(", match[2], ") ", match[3], "-", match[4]].join("");
  }
  return phoneNumberString;
};

export const formatPhoneNumber = (phoneNumber: string) => {
  return PHONE_NUMBERS_MAP[phoneNumber as PhoneNumber] || phoneNumber;
};
