import { Request, Response } from 'express';

export const createNewChatRoute = async (req: Request, res: Response) => {
  return res.status(500).json({success: false, msg: 'Route not implemented.'});
};
