import bookService from '@services/book.service';
import { Request, Response } from 'express';
import { Book } from '@schemas/book.schema';
import { IBook } from '@models/book.model';

const isBook = (book: any): book is IBook => {
  return (book as IBook).pages !== undefined &&
          (book as IBook).title !== undefined &&
          (book as IBook).author !== undefined &&
          (book as IBook).finished !== undefined;
}

export const addNewBookRoute = async (req: Request, res: Response) => {

  if (!isBook(req.body)) {
    return res.json({success: false, msg: 'Body is missing a parameter.'});
  }

  const newBook = new Book(req.body);

  const savedBook = await bookService.saveModel(newBook);

  if (savedBook) {
    return res.status(200).json({success: true, data: savedBook});
  }

  return res.status(500).json({success: false, msg: 'Something went wrong.'});
}
