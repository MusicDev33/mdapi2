import { IConversation } from '@models/conversation.model';
import { Conversation } from '@schemas/conversation.schema';
import { ModelService } from '@classes/model.service.class';

class ConversationService extends ModelService<IConversation> {
	private static instance: ConversationService;
	
	private constructor() {
		super(Conversation);
	}
	
	public static getInstance(): ConversationService {
		if (!ConversationService.instance) {
			ConversationService.instance = new ConversationService();
		}
		
		return ConversationService.instance;
	}
}

const conversationService = ConversationService.getInstance();
export default conversationService;
