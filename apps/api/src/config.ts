export const config = () => ({
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
  SESSION_SECRET: process.env.SESSION_SECRET,
  AZURE_STORAGE_SAS_KEY: process.env.AZURE_STORAGE_SAS_KEY,
  AZURE_STORAGE_ACCOUNT: process.env.AZURE_STORAGE_ACCOUNT,
});
