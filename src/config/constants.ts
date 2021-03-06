import dotenv from 'dotenv';
dotenv.config();

const dotenvCheck = (property: string | undefined): string => {
  if (!property) {
    throw new Error(`dotenv check failed on property`);
  }

  return property;
}

export const PORT = dotenvCheck(process.env.PORT);
export const AUTH_TOKEN = dotenvCheck(process.env.AUTH_TOKEN);
export const API_BASE = dotenvCheck(process.env.API_BASE);
export const DB_NAME = dotenvCheck(process.env.DB_NAME);
export const USER_PASS = dotenvCheck(process.env.USER_PASS);
export const RHY_PASS = dotenvCheck(process.env.RHY_PASS);
export const WHITELIST_CORS = dotenvCheck(process.env.WHITELIST_CORS).split(',');

export const ACCEPTED_AGENTS = ['MDAPIWebv1', 'MDReads'];

// Make sure dangerous defaults crash the program.
if (AUTH_TOKEN === 'lmao') {
  console.log('Change auth token.');
  process.exit(1);
}

if (USER_PASS === 'testpass') {
  console.log('Change password.');

  process.exit(1);
}

if (RHY_PASS === '???') {
  console.log('Change rhy password.');

  process.exit(1);
}
