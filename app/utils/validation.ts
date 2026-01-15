export const isEmailValid = (email: string) => {
  return /\S+@\S+\.\S+/.test(email);
};

export const isPhoneValid = (phone: string) => {
  return phone.length >= 10;
};
