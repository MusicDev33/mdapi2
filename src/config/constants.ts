import dotenv from 'dotenv';
dotenv.config();

const dotenvCheck = (property: string | undefined): string => {
  if (!property) {
    throw 'dotenv check failed.'
  }

  return property;
}

export const PORT = dotenvCheck(process.env.PORT);
export const AUTH_TOKEN = dotenvCheck(process.env.AUTH_TOKEN);
export const API_BASE = dotenvCheck(process.env.API_BASE);
export const DB_NAME = dotenvCheck(process.env.DB_NAME);

export const ACCEPTED_AGENTS = ['MDAPIWebv1', 'MDReads'];
