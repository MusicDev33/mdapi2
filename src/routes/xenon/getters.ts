import axios from 'axios';
import { Request, Response } from "express";
import { parseSite } from './parse';

import { IXRawSection } from '@models/xrawsection.model';
import { XRawSection } from '@schemas/xrawsection.schema';

import xRawSectionService from '@services/xrawsection.service';

const getAllXRawSections = (req: Request, res: Response) => {


  return res.json({success: true});
}
