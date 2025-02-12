export const AppConfig = {
  minPasswordLength: Number(process.env.MIN_PASSWORD_LENGTH) || 8,
  minUsernameLength: 4,
  maxUsernameLength: 32
};
