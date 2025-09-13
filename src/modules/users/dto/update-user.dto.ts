import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto implements Partial<Omit<CreateUserDto, 'password' | 'email'>> { }
