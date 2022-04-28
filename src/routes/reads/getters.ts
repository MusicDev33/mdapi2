import readsService from '@services/read.service';
import { Request, Response } from 'express';
import { Read } from '@schemas/read.schema';

// Get read by bookId
export const getReadByIdRoute = async (req: Request, res: Response) => {
  const bookId = req.params.bookId;

  if (bookId) {
    return res.status(500).json({success: false, msg: 'Must send valid bookId'});
  }

  const read = await readsService.findOneModelByParameter('bookId', bookId);

  if (!read) {
    return res.status(500).json({success: false, msg: `Could not find read with bookId ${bookId}`});
  }

  return res.json({success: true, data: read});
}

export const getReadsRoute = async (req: Request, res: Response) => {
  return res.status(500).json({success: false, msg: 'Could not find reads.'});
};
