export const FROM_NUMBER_ONE = "+16179483986";
export const FROM_NUMBER_TWO = "+442073238299";
export const FORMATTED_FROM_NUMBER_ONE = "+1 617-948-3986";
export const FORMATTED_FROM_NUMBER_TWO = "+44 20 7323 8299";

export const FROM_NUMBERS_MAP = {
  [FROM_NUMBER_ONE]: FORMATTED_FROM_NUMBER_ONE,
  [FROM_NUMBER_TWO]: FORMATTED_FROM_NUMBER_TWO,
};

export type PhoneNumber = typeof FROM_NUMBER_ONE | typeof FROM_NUMBER_TWO;

export const validateKeypadInput = (value: string) => {
  return /^[0-9+*#]*$/.test(value);
};

export const validatePhoneNumber = (value: string) => {
  return value.length > 2;
};

export const formatPhoneNumber = (phoneNumberString: string): string => {
  const cleaned = `${phoneNumberString}`.replace(/\D/g, "");
  const match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    const intlCode = match[1] ? "+1 " : "";
    return [intlCode, "(", match[2], ") ", match[3], "-", match[4]].join("");
  }
  return phoneNumberString;
};

export const getFormattedFromNumber = (phoneNumber: string) => {
  return FROM_NUMBERS_MAP[phoneNumber as PhoneNumber] || phoneNumber;
};
