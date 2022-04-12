import readsService from '@services/read.service';
import { Request, Response } from 'express';
import { Read } from '@schemas/read.schema';

export const getReadsRoute = async (req: Request, res: Response) => {
  return res.status(500).json({success: false, msg: 'Could not find reads.'});
};
