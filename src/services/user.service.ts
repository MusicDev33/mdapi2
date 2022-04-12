import { IUser } from '@models/user.model';
import { User } from '@schemas/user.schema';
import { ModelService } from '@classes/model.service.class';

class UserService extends ModelService<IUser> {
	private static instance: UserService;
	
	private constructor() {
		super(User);
	}
	
	public static getInstance(): UserService {
		if (!UserService.instance) {
			UserService.instance = new UserService();
		}
		
		return UserService.instance;
	}
}

const userService = UserService.getInstance();
export default userService;
