// A regisztráció szabályai. A backend RegisterRequestDTO-ja ugyanezeket ellenőrzi,
// a felületen azért is, hogy a felhasználó azonnal visszajelzést kapjon.

export const USERNAME_MIN = 3;
export const USERNAME_MAX = 30;
export const USERNAME_PATTERN = /^[A-Za-z0-9_.-]+$/;
export const PASSWORD_MIN = 6;
export const PASSWORD_MAX = 72;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Hibaüzenetet ad vissza, vagy null-t, ha minden rendben
export const validateRegistration = ({ username, email, password, confirmPassword }) => {
  if (username.length < USERNAME_MIN || username.length > USERNAME_MAX) {
    return `A felhasználónév ${USERNAME_MIN} és ${USERNAME_MAX} karakter között legyen!`;
  }
  if (!USERNAME_PATTERN.test(username)) {
    return "A felhasználónév csak angol betűt, számot, pontot, kötőjelet és aláhúzást tartalmazhat!";
  }
  if (!EMAIL_PATTERN.test(email)) {
    return "Kérlek, valós email címet adj meg!";
  }
  if (password.length < PASSWORD_MIN || password.length > PASSWORD_MAX) {
    return `A jelszó ${PASSWORD_MIN} és ${PASSWORD_MAX} karakter között legyen!`;
  }
  if (password !== confirmPassword) {
    return "A két jelszó nem egyezik meg!";
  }
  return null;
};