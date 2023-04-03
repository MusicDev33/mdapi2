import { Request, Response } from "express";

import conversationService from "@services/conversation.service";
import chatService from "@services/chat.service";

export const getConversationsRoute = async (req: Request, res: Response) => {
  const convs = await conversationService.findModelsByParameter('user', req.params.username);
  console.log(convs)

  if (!convs) {
    return res.status(500).json({success: false, msg: 'Something went wrong'});
  }

  return res.status(200).json({success: true, data: convs});
};

export const getChatsByConvIdRoute = async (req: Request, res: Response) => {
  const chats = await chatService.findModelsByParameter('conversationId', req.params.convId, {timestamp: 1});
  if (!chats) {
    return res.status(500).json({success: false, msg: 'Something went wrong'});
  }

  return res.status(200).json({success: true, data: chats});
}