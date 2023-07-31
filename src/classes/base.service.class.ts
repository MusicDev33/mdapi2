import { IBook } from '@models/book.model';
import { Book } from '@schemas/book.schema';

import { ModelService } from '@classes/model.service.class';

import { Document, Model } from 'mongoose';

class BaseService extends ModelService<IBook> {
	private static instance: BaseService;
	
	private constructor() {
		super(Book);
	}
	
	public static getInstance(): BaseService {
		if (!BaseService.instance) {
			BaseService.instance = new BaseService();
		}
		
		return BaseService.instance;
	}
}

const service = BaseService.getInstance();
export default service;
