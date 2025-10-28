import dotenv from 'dotenv';
dotenv.config();

const updatedDotenvCheck = (property: string): string => {
  const prop = process.env[property];
  if (!prop) {
    throw new Error(`dotenv check failed on property ${property}`);
  }

  return prop;
}

export const PORT = updatedDotenvCheck('PORT');
export const AUTH_TOKEN = updatedDotenvCheck('AUTH_TOKEN');
export const API_BASE = updatedDotenvCheck('API_BASE');
export const DB_NAME = updatedDotenvCheck('DB_NAME');
export const USER_PASS = updatedDotenvCheck('USER_PASS');
export const RHY_PASS = updatedDotenvCheck('RHY_PASS');
export const WHITELIST_CORS = updatedDotenvCheck('WHITELIST_CORS').split(',');
export const OPEN_AI_API_KEY = updatedDotenvCheck('OPEN_AI_API_KEY');
export const ANTHROPIC_API_KEY = updatedDotenvCheck('ANTHROPIC_API_KEY');
export const DEEPSEEK_API_KEY = updatedDotenvCheck('DEEPSEEK_API_KEY');
export let WHITELIST_USERS = updatedDotenvCheck('WHITELIST_USERS').split(',');
export let DB_URI = updatedDotenvCheck('DB_URI');

export const M_SITE_URL = updatedDotenvCheck('M_SITE_URL');
export const R_SITE_URL = updatedDotenvCheck('R_SITE_URL')

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

