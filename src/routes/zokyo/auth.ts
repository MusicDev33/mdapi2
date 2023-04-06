import { Request, Response } from 'express';
import { USER_PASS } from '@config/constants';

import zUserService from '@services/zuser.service';
import { ZUser } from '@schemas/zuser.schema';

export const authRoute = async (req: Request, res: Response) => {
  const username = req.body.username;
  const password = req.body.password;

  const user = await zUserService.findOneModelByQuery({username, password});
  if (!user) {
    return res.status(401).json({success: false});
  }

  return res.status(200).json({success: true, data: user});
}

export const createLoginRoute = async (req: Request, res: Response) => {
  if (req.body.authPass !== USER_PASS) {
    return res.status(401).json({success: false});
  }

  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({success: false});
  }

  const savedZUser = await zUserService.saveModel(new ZUser({username, password}));
  if (!savedZUser) {
    return res.status(500).json({success: false});
  }

  return res.status(200).json({success: true, data: savedZUser});
}
