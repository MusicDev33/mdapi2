import bookService from '@services/book.service';
import { Request, Response } from 'express';

// Gives the last 30 books read by me
export const getBooksRoute = async (req: Request, res: Response) => {
  const books = await bookService.findModelsByQuery({});

  if (!books) {
    return res.status(500).json({success: false, msg: 'Something went wrong'});
  }

  return res.status(200).json({success: true, data: books});
};

export const getBookByIdRoute = async (req: Request, res: Response) => {
  const id = req.params.id;

  if (!id) {
    return res.json({success: false, msg: 'Must supply valid id in URL.'});
  }

  const book = await bookService.findOneModelByQuery({_id: req.params.id});

  if (!book) {
    return res.json({success: false, msg: `Could not find book with id '${req.params.id}'`});
  }

  return res.json({success: true, data: book});
}

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
