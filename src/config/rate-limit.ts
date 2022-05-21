import limit from 'express-rate-limit';

const oneMin = 60 * 1000;

export const authLimit = limit({
  windowMs: 5 * oneMin,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false
});

export const genLimit = limit({
  windowMs: 5 * oneMin,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false
});
