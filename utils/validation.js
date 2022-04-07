export const isEmailValid = (email) => {
  const validation =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return validation.test(email);
};

export const isNameValid = (name) => {
  const validation = /^(?! )[A-Za-z\s]{2,20}$/;
  return validation.test(name);
};
