import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';

import { WHITELIST_USERS } from '@config/constants';

import zUserService from '@services/zuser.service';
import { ZUser } from '@schemas/zuser.schema';

import { getPassMsg, getUserNotFoundMsg } from './assets';

export const authRoute = async (req: Request, res: Response) => {
  const username = req.body.username;
  const password = req.body.password;

  const user = await zUserService.findOneModelByQuery({username});
  if (!user) {
    return res.status(200).json({success: false, msg: getUserNotFoundMsg()});
  }

  const passwordsMatch = await bcrypt.compare(password, user.password);
  if (!passwordsMatch) {
    // Should be 401 but Axios defaults to throwing errors instead of letting me handle them
    return res.status(200).json({success: false, msg: getPassMsg()});
  }

  // Don't really want to send the entire user object with the password, now do we?
  const userData = {
    username: user.username,
    _id: user._id
  }

  return res.status(200).json({success: true, data: userData});
}

export const createLoginRoute = async (req: Request, res: Response) => {
  const username = req.body.username;
  const password = req.body.password;
  
  if (!username || !password) {
    return res.status(400).json({success: false});
  }

  if (!WHITELIST_USERS.includes(username)) {
    return res.status(401).json({success: false});
  }
  
  const hashedPassword = await bcrypt.hash(req.body.password, 12);
  
  const savedZUser = await zUserService.saveModel(new ZUser({username, password: hashedPassword}));
  if (!savedZUser) {
    return res.status(500).json({success: false});
  }

  const userData = {
    username: savedZUser.username,
    _id: savedZUser._id
  }

  return res.status(200).json({success: true, data: userData});
}

export const checkWhitelistUserRoute = async (req: Request, res: Response) => {
  const username = req.params.username;

  const user = await zUserService.findOneModelByParameter('username', username);
  if (user) {
    return res.status(200).json({success: false});
  }

  if (WHITELIST_USERS.includes(username)) {
    return res.status(200).json({success: true});
  }

  return res.status(200).json({success: false});
}
