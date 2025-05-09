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
export const OPEN_AI_API_KEY = dotenvCheck(process.env.OPEN_AI_API_KEY);
export const ANTHROPIC_API_KEY = dotenvCheck(process.env.ANTHROPIC_API_KEY);
export const DEEPSEEK_API_KEY = dotenvCheck(process.env.DEEPSEEK_API_KEY);
export let WHITELIST_USERS = dotenvCheck(process.env.WHITELIST_USERS).split(',');

export const M_SITE_URL = dotenvCheck(process.env.M_SITE_URL);
export const R_SITE_URL = dotenvCheck(process.env.R_SITE_URL)

export const ACCEPTED_AGENTS = ['MDAPIWebv1', 'MDReads'];

// Make sure dangerous defaults crash the program.
if (AUTH_TOKEN === 'lmao') {
  console.log('Change auth token.');
  process.exit(1);
}

if (OPEN_AI_API_KEY === 'lmao') {
  console.log('Change OpenAI API key.');
  process.exit(1);
}

if (ANTHROPIC_API_KEY === 'lmao') {
  console.log('Change Anthropic API key.');
  process.exit(1);
}

if (DEEPSEEK_API_KEY === 'lmao') {
  console.log('Change DeepSeek API key.');
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

if (WHITELIST_USERS.includes('test1')) {
  WHITELIST_USERS = [];
}

if (M_SITE_URL == 'blahblah.org') {
  console.error('M_SITE not set');

  process.exit(1);
}

if (R_SITE_URL == 'blahblah.org') {
  console.error('R_SITE not set');

  process.exit(1);
}

