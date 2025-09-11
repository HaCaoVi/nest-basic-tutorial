import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from './schemas/user.schema';
import { SecurityHelper } from 'src/common/helpers/security.helper';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private securityHelper: SecurityHelper
  ) { }

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
