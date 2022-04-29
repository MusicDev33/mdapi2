import readsService from '@services/read.service';
import { Request, Response } from 'express';
import { Read } from '@schemas/read.schema';

export const createOneReadRoute = async (req: Request, res: Response) => {
  const body = req.body;

  
  if (!body.bookId || !body.currentPage) {
    return res.status(500).json({success: false, msg: 'Must supply a book ID and currentPages'});
  }
  
  const readExists = await readsService.findOneModelByParameter('bookId', body.bookId);

  if (readExists) {
    return res.status(500).json({success: false, msg: 'A read with that bookId already exists!'});
  }

  const newRead = new Read({
    currentPage: body.currentPage,
    current: true,
    bookId: body.bookId
  });

  const savedRead = await readsService.saveModel(newRead);

  if (savedRead) {
    return res.json({success: true, data: savedRead});
  }

  return res.status(500).json({success: false, msg: 'Could not save read.'});
};
