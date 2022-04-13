import bookService from '@services/book.service';
import { Request, Response } from 'express';
import { Book } from '@schemas/book.schema';

export const getBooksRoute = async (req: Request, res: Response) => {


  return res.status(500).json({success: false, msg: 'Could not find books.'});
};

export const searchBooksRoute = async (req: Request, res: Response) => {
  if (!req.params.searchTerm) {
    return res.json({success: false, msg: 'Must include a search term!'});
  }

  const searchTerm = req.params.searchTerm.replaceAll('+', ' ');
  const query = {$text: { $search: searchTerm }};

  const foundBooks = await bookService.findModelsByQuery(query);

  if (!foundBooks) {
    return res.status(500).json({success: false, msg: 'Something went wrong.'});
  }

  return res.json({success: true, msg: 'Found books', data: foundBooks});
}
