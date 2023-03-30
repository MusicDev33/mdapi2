import { IChat } from '@models/chat.model';
import { Chat } from '@schemas/chat.schema';
import { ModelService } from '@classes/model.service.class';

class ChatService extends ModelService<IChat> {
	private static instance: ChatService;
	
	private constructor() {
		super(Chat);
	}
	
	public static getInstance(): ChatService {
		if (!ChatService.instance) {
			ChatService.instance = new ChatService();
		}
		
		return ChatService.instance;
	}
}

const chatService = ChatService.getInstance();
export default chatService;
