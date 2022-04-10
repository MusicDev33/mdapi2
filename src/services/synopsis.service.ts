import { ISynopsis } from '@models/synopsis.model';
import { Synopsis } from '@schemas/synopsis.schema';
import { ModelService } from '@classes/model.service.class';

class SynopsisService extends ModelService<ISynopsis> {
	private static instance: SynopsisService;
	
	private constructor() {
		super(Synopsis);
	}
	
	public static getInstance(): SynopsisService {
		if (!SynopsisService.instance) {
			SynopsisService.instance = new SynopsisService();
		}
		
		return SynopsisService.instance;
	}
}

const synopsisService = SynopsisService.getInstance();
export default synopsisService;
