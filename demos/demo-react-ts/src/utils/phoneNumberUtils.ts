export const validateKeypadInput = (value: string) => {
  return /^[0-9+*#]*$/.test(value);
};

export const validatePhoneNumber = (value: string) => {
  return value.length > 2;
};
