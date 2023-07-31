import { Request, Response } from 'express';
import { parseSite } from './parse';

import { IXRawSection } from '@models/xrawsection.model';
import { XRawSection } from '@schemas/xrawsection.schema';

import xRawSectionService from '@services/xrawsection.service';
import xSourceService from '@services/xsource.service';

export const getAllXRawSectionsRoute = async (req: Request, res: Response) => {
  const sections = ''

  return res.json({success: true});
}

export const getAllXSourcesRoute = async (req: Request, res: Response) => {
  const sources = await xSourceService.findModelsByQuery({}, {}, 100);
  if (!sources) {
    return res.status(500).json({success: false, msg: 'Something went wrong, but it\'s not on your end!'});
  }

  return res.json({success: true, msg: 'Success', data: sources});
}
