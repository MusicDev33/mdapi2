import synopsisService from '@services/synopsis.service';
import { Request, Response } from 'express';
import { Synopsis } from '@schemas/synopsis.schema';

export const getSynopsisRoute = async (req: Request, res: Response) => {
  return res.status(500).json({success: false, msg: 'Could not find synopsis.'});
};
