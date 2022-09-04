export const config = () => ({
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
  SESSION_SECRET: process.env.SESSION_SECRET,
});
