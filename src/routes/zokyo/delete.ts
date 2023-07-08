import { Request, Response } from "express";

import conversationService from "@services/conversation.service";
import chatService from "@services/chat.service";

export const deleteConversationByIdRoute = async (req: Request, res: Response) => {
  console.log(`Deleting conversation: ${req.params.convId}`);

  const deletedChats = await chatService.deleteModelsByQuery({convId: req.params.convId});

  if (!deletedChats) {
    console.log('Something went wrong with deleting chats!');
    return res.status(500).json({success: false, msg: 'Something went wrong the chats'});
  }
  
  const deletedConv = await conversationService.deleteModelsByQuery({_id: req.params.convId});
  
  if (!deletedConv) {
    console.log('Something went wrong with deleting a conversation!');
    return res.status(500).json({success: false, msg: 'Something went wrong with deleting the conversation'});
  }

  return res.status(200).json({success: true, msg: 'Successfully deleted conversation!'});
}
