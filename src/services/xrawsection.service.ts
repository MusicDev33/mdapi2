import { IXRawSection } from '@models/xrawsection.model';
import { XRawSection } from '@schemas/xrawsection.schema';
import { ModelService } from '@classes/model.service.class';

class XRawSectionService extends ModelService<IXRawSection> {
	private static instance: XRawSectionService;
	
	private constructor() {
		super(XRawSection);
	}
	
	public static getInstance(): XRawSectionService {
		if (!XRawSectionService.instance) {
			XRawSectionService.instance = new XRawSectionService();
		}
		
		return XRawSectionService.instance;
	}
}

const service = XRawSectionService.getInstance();
export default service;
