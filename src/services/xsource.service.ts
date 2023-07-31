import { IXSource } from '@models/xsource.model';
import { XSource } from '@schemas/xsource.schema';
import { ModelService } from '@classes/model.service.class';

class XSourceService extends ModelService<IXSource> {
	private static instance: XSourceService;
	
	private constructor() {
		super(XSource);
	}
	
	public static getInstance(): XSourceService {
		if (!XSourceService.instance) {
			XSourceService.instance = new XSourceService();
		}
		
		return XSourceService.instance;
	}
}

const service = XSourceService.getInstance();
export default service;
