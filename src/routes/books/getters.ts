import appointmentService from '@services/book.service';
import { Request, Response } from 'express';
import { Book } from '@schemas/book.schema';

export const getBooksRoute = async (req: Request, res: Response) => {
  return res.status(500).json({success: false, msg: 'Could not find books.'});
};
