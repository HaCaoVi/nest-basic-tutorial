import { BadRequestException, HttpException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AccountType, User } from './schemas/user.schema';
import { SecurityHelper } from '@common/helpers/security.helper';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private securityHelper: SecurityHelper,
    private jwtService: JwtService,
  ) { }

  async handleRegister(user: RegisterUserDto) {
    try {
      const { email, password } = user
      const isEmailExist = await this.userModel.exists({ email, isDeleted: false, accountType: AccountType.LOCAL });

      if (isEmailExist) {
        throw new BadRequestException("Email already exists!");
      }

      const hashPass = await this.securityHelper.hashPassword(password);
      const newUser = await this.userModel.create({ ...user, password: hashPass, role: "USER", accountType: AccountType.LOCAL })
      return {
        id: newUser._id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      };
    } catch (error) {
      this.logger.error(error.message, error.stack);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Something went wrong!');
    }
  }

  async create(createUserDto: CreateUserDto) {
    const { email, name, password } = createUserDto
    const hashPassword = await this.securityHelper.hashPassword(password)
    const user = await this.userModel.create({ email, name, password: hashPassword })
    return user;
  }

  findAll() {
    return `This action returns all users`;
  }

  findUserByUsername = async (username: string) => {
    try {
      const user = await this.userModel.findOne({ email: username })

      if (!user) return null
      return user;
    } catch (error) {
      return null
    }
  }

  async findOne(id: string) {
    try {
      const user = await this.userModel.findById(id)
      return user;
    } catch (error) {
      return null
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Id must be ObjectId');
      }
      const result = await this.userModel.findByIdAndUpdate(id, { ...updateUserDto }, { new: true })
      return result
    } catch (error) {
      return error.message
    }
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
