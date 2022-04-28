import readsService from '@services/read.service';
import { Request, Response } from 'express';

export const updateOneReadRoute = async (req: Request, res: Response) => {
  const read = await readsService.findOneModelByParameter('bookId', req.params.bookId);

  if (!read) {
    return res.status(500).json({success: false, msg: `Could not find reads with bookId '${req.params.bookId}'`});
  }

  read.currentPage = req.body.currentPage;

  const savedRead = await readsService.saveChangedModel(read, 'currentPage');

  if (!savedRead) {
    return res.status(500).json({success: false, msg: 'Could not save read.'});
  }

  return res.json({success: true, data: savedRead});
};
