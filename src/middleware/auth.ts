import { Request, Response, NextFunction } from 'express';
import { ACCEPTED_AGENTS, AUTH_TOKEN } from '@config/constants';

export const generalAuth = (req: Request, res: Response, next: NextFunction) => {
  const authToken = req.header('MDAuthToken');

  if (!authToken || authToken !== AUTH_TOKEN) {
    return res.status(401).json({success: false});
  }

  return next();
}

export const checkAgent = (req: Request, res: Response, next: NextFunction) => {
  const agent = req.header('MDAgent');

  if (!agent || !ACCEPTED_AGENTS.includes(agent)) {
    return res.status(401).json({success: false});
  }

  return next();
}
