import synopsisService from '@services/synopsis.service';
import { Request, Response } from 'express';
import { Synopsis } from '@schemas/synopsis.schema';

export const getSynopsisRoute = async (req: Request, res: Response) => {
  if (!req.params.id) {
    return res.json({success: false, msg: 'Must include an id!'});
  }

  const synopsis = await synopsisService.findOneModelByQuery({bookId: req.params.id});

  if (synopsis) {
    return res.json({success: true, data: synopsis});
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
