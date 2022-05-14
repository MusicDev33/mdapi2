import synopsisService from '@services/synopsis.service';
import { Request, Response } from 'express';
import { Synopsis } from '@schemas/synopsis.schema';

export const editSynopsisDescRoute = async (req: Request, res: Response) => {
  console.log('test')
  if (!req.body.description) {
    return res.json({success: false, msg: 'Must add description.'});
  }

  const bookId = req.params.id;

  const synopsis = await synopsisService.findOneModelByQuery({bookId: bookId});

  if (!synopsis) {
    return res.json({success: false, msg: `Could not find synopsis with bookId '${bookId}'`});
  }

  // This is actually really inefficient because I'll be saving a bunch of redundant text,
  // but resolving this with deltas would take a while to implement.
  synopsis.description = req.body.description;

  const savedSynopsis = await synopsisService.saveChangedModel(synopsis, 'description');

  if (!savedSynopsis) {
    return res.json({success: false, msg: 'Could not save description.'});
  }

  return res.json({success: true, data: savedSynopsis});
};
