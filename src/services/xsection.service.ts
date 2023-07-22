import { IXSection } from '@models/xsection.model';
import { XSection } from '@schemas/xsection.schema';
import { ModelService } from '@classes/model.service.class';

class XSectionService extends ModelService<IXSection> {
	private static instance: XSectionService;
	
	private constructor() {
		super(XSection);
	}
	
	public static getInstance(): XSectionService {
		if (!XSectionService.instance) {
			XSectionService.instance = new XSectionService();
		}
		
		return XSectionService.instance;
	}
}

const service = XSectionService.getInstance();
export default service;
