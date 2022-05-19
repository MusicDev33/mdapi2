import { Request, Response, NextFunction } from 'express';
import { ACCEPTED_AGENTS, AUTH_TOKEN } from '@config/constants';

export const generalAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.header('MDAuthToken') || req.header('MDAuthToken') !== AUTH_TOKEN) {
    return res.status(401).json({success: false});
  }

  return next();
}

export const checkAgent = (req: Request, res: Response, next: NextFunction) => {
  const agent = req.header('MD-Agent');

  if (!agent || !ACCEPTED_AGENTS.includes(agent)) {
    return res.status(401).json({success: false});
  }

  return next();
}
