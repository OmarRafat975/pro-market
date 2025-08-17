export const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateString = (name: string, length = 2) => {
  return name.trim() !== "" && name.trim().length > length;
};

export const validatePassword = (password: string) => {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&\.])[A-Za-z\d@$!%*?&\.]{8,}$/;
  return passwordRegex.test(password);
};

export const isValidImgUrl = (imgUrl: string) => {
  try {
    new URL(imgUrl);
    return imgUrl;
  } catch {
    return "/no-image.png";
  }
};
