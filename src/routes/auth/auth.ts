import { Request, Response } from 'express';

import { AUTH_TOKEN, USER_PASS, RHY_PASS } from 'config/constants';

// Don't allow double semicolons in the password
export const getAuthTokenRoute = (req: Request, res: Response) => {
  if (!req.body.password.includes('::')) {
    return res.status(401).json({success: false, msg: 'Incorrect password.'});
  }

  const passData = req.body.password.split('::');
  const protocol = passData[0];
  const password = passData[1];

  if (protocol === 'def' && USER_PASS == password) {
    return res.json({success: true, data: AUTH_TOKEN});
  }

  if (protocol === 'rhy') {
    const result = validateRhythm(password);

    console.log(password);
    console.log(result);

    if (result) {
      return res.json({success: true, data: AUTH_TOKEN});
    }
  }

  return res.status(401).json({success: false, msg: 'Incorrect password.'});
}

// Rhythm Validation
const rhythmPass = RHY_PASS.split(',') // test password

const tolerance = 0.2;
const bpm = 120;
const oneMin = 60000; // milliseconds in a minute
const approvedRhythyms = [8, 12, 16];

const ranges: Map<number, number[]> = new Map();

for (let rhythm of approvedRhythyms) {
  const target = oneMin / ((rhythm * bpm) / 4);
  const targetTolerance = target * tolerance;

  const bottom = target - targetTolerance;
  const top = target + targetTolerance;

  ranges.set(rhythm, [bottom, top]);
}

const rhythmInRange = (rhythm: number, rhythmData: number): boolean => {
  const range = ranges.get(rhythm);

  if (!range) {
    return false;
  }

  console.log(`val: ${rhythmData}, low: ${range[0]}, high: ${range[1]}`);

  if (rhythmData >= range[0] && rhythmData <= range[1]) {
    return true;
  }

  return false;
}

const validateRhythm = (rhythm: string): boolean => {
  const rhythmData = rhythm.split(',').map(num => parseFloat(num));
  
  if (rhythmData.length < rhythmPass.length - 1) {
    return false;
  }

  for (let i = 0; i < rhythmData.length; i++) {
    if (!rhythmInRange(parseFloat(rhythmPass[i]), rhythmData[i])) {
      return false;
    }
  }

  return true;
}
