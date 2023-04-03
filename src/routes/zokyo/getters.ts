import { Request, Response } from "express";
import conversationService from "@services/conversation.service";

export const getConversationsRoute = async (req: Request, res: Response) => {
  const convs = await conversationService.findModelsByParameter('user', req.params.username);
  console.log(convs)

  if (!convs) {
    return res.status(500).json({success: false, msg: 'Something went wrong'});
  }

  return res.status(200).json({success: true, data: convs});
};
