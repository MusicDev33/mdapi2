import bookService from '@services/book.service';
import { Request, Response } from 'express';

type ValidBody = {
  newValue: string,
  attribute: string
}

const isValidBody = (body: any): body is ValidBody => {
  return (body as ValidBody).newValue !== undefined &&
          (body as ValidBody).attribute !== undefined;
}

// Change book attribute, like title or author
export const changeBookAttrRoute = async (req: Request, res: Response) => {

  const body = req.body;
  const id = req.params.id;

  if (!isValidBody(body)) {
    return res.json({success: false, msg: 'Body is missing a parameter.'});
  }

  const book = await bookService.findOneModelByQuery({_id: id});

  if (!book) {
    return res.json({success: false, msg: `Could not find book with id '${id}'`});
  }

  const changedObject = await bookService.changeObject(id, body.attribute, body.newValue);

  if (!changedObject) {
    return res.json({success: false, msg: 'Could not save changes'});
  }

  return res.json({success: true, data: changedObject});
}
