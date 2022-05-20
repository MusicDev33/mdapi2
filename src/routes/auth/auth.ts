import { Request, Response } from 'express';

import { AUTH_TOKEN, USER_PASS } from 'config/constants';

export const getAuthTokenRoute = (req: Request, res: Response) => {
  const password = req.body.password;

  if (USER_PASS == password) {
    return res.json({success: true, data: AUTH_TOKEN});
  }

  return res.status(401).json({success: false, msg: 'Incorrect password.'});
}
