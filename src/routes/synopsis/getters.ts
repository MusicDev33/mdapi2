import synopsisService from '@services/synopsis.service';
import bookService from '@services/book.service';
import { Request, Response } from 'express';
import { Synopsis } from '@schemas/synopsis.schema';

export const getSynopsisRoute = async (req: Request, res: Response) => {
  // Experimenting with new ways of declaring routes
  if (!req.params.id && !req.params.bookId) {
    return res.json({success: false, msg: 'Must include an id!'});
  }

  let synopsis;
  let book;

  // This new approach feels messy...hmmmm
  if (req.params.id) {
    synopsis = await synopsisService.findOneModelByQuery({_id: req.params.id});
    book = await bookService.findOneModelByQuery({_id: synopsis?.bookId});
  } else {
    synopsis = await synopsisService.findOneModelByQuery({bookId: req.params.bookId});
  }

  if (synopsis) {
    if (!synopsis.public) {
      synopsis['public'] = false;

      await synopsisService.saveChangedModel(synopsis, 'public');
    }

    return res.json({
      success: true, data: {
        synopsis,
        book: book ? book : {}
      }
    });
  }

  const newSynopsis = new Synopsis({
    bookId: req.params.id,
    description: ''
  });

  const savedSynopsis = await synopsisService.saveModel(newSynopsis);

  if (!savedSynopsis) {
    return res.json({success: false, msg: 'Could not create new synopsis object'});
  }

  return res.json({success: true, data: savedSynopsis});
};
