import dotenv from 'dotenv';
dotenv.config();

const dotenvCheck = (property: string | undefined): string => {
  if (!property) {
    throw 'dotenv check failed.'
  }

  return property;
}

export const PORT = dotenvCheck(process.env.PORT);
export const API_BASE = dotenvCheck(process.env.API_BASE);
export const DB_SECRET = dotenvCheck(process.env.DB_SECRET);
export const DB_NAME = dotenvCheck(process.env.DB_NAME);
export const APPT_EMAIL = dotenvCheck(process.env.APPT_EMAIL);
export const EMAIL_PASS = dotenvCheck(process.env.EMAIL_PASS);
export const ALLOWED_ORIGINS = dotenvCheck(process.env.ALLOWED_ORIGINS).split(',');

export const ACCEPTED_AGENTS = ['MDAPIWebv1'];