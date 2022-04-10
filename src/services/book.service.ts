import { IBook } from '@models/book.model';
import { Book } from '@schemas/book.schema';
import { ModelService } from '@classes/model.service.class';

class BookService extends ModelService<IBook> {
	private static instance: BookService;
	
	private constructor() {
		super(Book);
	}
	
	public static getInstance(): BookService {
		if (!BookService.instance) {
			BookService.instance = new BookService();
		}
		
		return BookService.instance;
	}
}

const bookService = BookService.getInstance();
export default bookService;
