export const validateKeypadInput = (value: string) => {
  return /^[0-9+*#]*$/.test(value);
};

export const validatePhoneNumber = (value: string) => {
  return value.length > 2;
};

export const formatPhoneNumber = (phoneNumberString: string): string => {
  var cleaned = ("" + phoneNumberString).replace(/\D/g, "");
  var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    var intlCode = match[1] ? "+1 " : "";
    return [intlCode, "(", match[2], ") ", match[3], "-", match[4]].join("");
  }
  return phoneNumberString;
};
