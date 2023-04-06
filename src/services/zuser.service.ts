import { IZUser } from '@models/zuser.model';
import { ZUser } from '@schemas/zuser.schema';
import { ModelService } from '@classes/model.service.class';

class ZUserService extends ModelService<IZUser> {
	private static instance: ZUserService;
	
	private constructor() {
		super(ZUser);
	}
	
	public static getInstance(): ZUserService {
		if (!ZUserService.instance) {
			ZUserService.instance = new ZUserService();
		}
		
		return ZUserService.instance;
	}
}

const zuserService = ZUserService.getInstance();
export default zuserService;
