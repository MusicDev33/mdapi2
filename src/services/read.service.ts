import { IRead } from '@models/read.model';
import { Read } from '@schemas/read.schema';
import { ModelService } from '@classes/model.service.class';

class ReadService extends ModelService<IRead> {
	private static instance: ReadService;
	
	private constructor() {
		super(Read);
	}
	
	public static getInstance(): ReadService {
		if (!ReadService.instance) {
			ReadService.instance = new ReadService();
		}
		
		return ReadService.instance;
	}
}

const readService = ReadService.getInstance();
export default readService;
