import { BadRequestException, HttpException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateUserDto, RegisterUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { AccountType, User } from './schemas/user.schema';
import type { UserModelType } from './schemas/user.schema';
import { SecurityHelper } from '@common/helpers/security.helper';
import type { IInfoDecodeToken, PaginatedResult } from '@common/interfaces/customize.interface';
import { normalizeFilters } from '@common/helpers/convert.helper';
import { RolesService } from '@modules/roles/roles.service';
import { USER_ROLE } from '@modules/databases/sample';
import { buildPopulateConfigFromStrings } from '@common/helpers/mongoose-populate.helper';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectModel(User.name) private userModel: UserModelType,
    private securityHelper: SecurityHelper,
    private roleService: RolesService,
  ) { }

  async handleRegister(user: RegisterUserDto) {
    try {
      const { email, password } = user;

      const normalRole = await this.roleService.findRoleByName(USER_ROLE);

      const isEmailExist = await this.userModel.exists({ email, isDeleted: false, accountType: AccountType.LOCAL });

      if (isEmailExist) {
        throw new BadRequestException("Email already exists!");
      }

      const hashPass = await this.securityHelper.hashBcrypt(password);
      const newUser = await this.userModel.create({ ...user, password: hashPass, role: normalRole._id, accountType: AccountType.LOCAL });
      return {
        id: newUser._id,
        createdAt: newUser.createdAt
      };
    } catch (error) {
      this.logger.error(error.message, error.stack);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Something went wrong!');
    }
  }

  async create(user: IInfoDecodeToken, createUserDto: CreateUserDto) {
    try {
      const { email, password, ...rest } = createUserDto

      const [isEmailExist] = await Promise.all([
        this.userModel.exists({ email, isDeleted: false, accountType: AccountType.LOCAL }),
      ]);

      if (isEmailExist) {
        throw new BadRequestException("Email already exists!");
      }
      const hashPass = await this.securityHelper.hashBcrypt(password);
      const newUser = await this.userModel.create({ ...rest, email, password: hashPass, role: "ADMIN", accountType: AccountType.LOCAL, createdBy: user._id })

      return {
        id: newUser._id,
        createdAt: newUser.createdAt
      };
    } catch (error) {
      this.logger.error(error.message, error.stack);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Something went wrong!');
    }
  }

  async findUserByUsername(username: string) {
    try {
      const user = await this.userModel
        .findOne({ email: username, accountType: AccountType.LOCAL })
        .populate({
          path: "role",
          select: "_id name"
        })

      if (!user) return null
      return user;
    } catch (error) {
      return null
    }
  }

  async findAll(current: number, pageSize: number, filters: Record<string, any> = {}): Promise<PaginatedResult<User>> {
    try {
      if (!current) current = 1
      if (!pageSize) pageSize = 10

      const { sort, populate, fields, ...filter } = filters
      const populateConfig = buildPopulateConfigFromStrings(populate, fields)
      const skip = (current - 1) * pageSize;

      const [totalItems, result] = await Promise.all([
        this.userModel.countDocuments(normalizeFilters(filter)),
        this.userModel
          .find(normalizeFilters(filter))
          .skip(skip)
          .limit(pageSize)
          .sort(sort)
          .populate(populateConfig)
          .lean<User[]>()
          .exec()
      ]);

      const totalPages = Math.ceil(totalItems / pageSize);

      return {
        meta: {
          current,
          pageSize,
          pages: totalPages,
          total: totalItems,
        },
        result,
      };
    } catch (error) {
      this.logger.error(error.message, error.stack);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Something went wrong!');
    }
  }

  async findOne(id: string): Promise<User> {
    try {
      const user = await this.userModel.findById(id)
        .select('-password -refreshToken')
        .populate([
          {
            path: "role",
            select: "_id name"
          },
          {
            path: "permission",
            select: "_id name apiPath module method"
          }
        ])
        .lean<User>();
      if (!user) throw new NotFoundException(`User with id ${id} not found`);
      return user;
    } catch (error) {
      this.logger.error(error.message, error.stack);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Something went wrong!');
    }
  }

  async update(user: IInfoDecodeToken, id: string, updateUserDto: UpdateUserDto) {
    try {
      const updated = await this.userModel.updateOne({ _id: id }, { ...updateUserDto, updatedBy: user._id }, { runValidators: true })
      if (!updated) throw new NotFoundException(`User with id ${id} not found`);
      return updated;
    } catch (error) {
      this.logger.error(error.message, error.stack);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Something went wrong!');
    }
  }

  async remove(user: IInfoDecodeToken, id: string) {
    try {
      const checkUser = await this.userModel.findById(id);

      if (checkUser?.email === "admin@gmail.com") {
        throw new BadRequestException("Can't delete this account")
      }


      const result = await this.userModel.softDeleteOne({ _id: id }, user._id)
      if (result.matchedCount === 0) throw new NotFoundException(`User with id ${id} not found`);
      return result;
    } catch (error) {
      this.logger.error(error.message, error.stack);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Something went wrong!');
    }
  }

  async updateUserToken(id: string, refreshToken: string) {
    try {
      const hashToken = this.securityHelper.hashTokenSHA256(refreshToken)
      return this.userModel.updateOne({ _id: id }, { refreshToken: hashToken })
    } catch (error) {
      this.logger.error(error.message, error.stack);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Something went wrong!');
    }
  }

  async isRefreshTokenValid(userId: string, refreshToken: string) {
    try {
      const user = await this.userModel.findById(userId).lean<User>();
      if (!user) throw new NotFoundException(`User with id ${userId} not found`);
      const isValid = user.refreshToken === this.securityHelper.hashTokenSHA256(refreshToken)
      if (!isValid) throw new BadRequestException(`Token invalid!`);
      return true
    } catch (error) {
      this.logger.error(error.message, error.stack);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Something went wrong!');
    }
  }

  async updateRefreshToken(userId: string, newToken: string) {
    try {
      const hashToken = this.securityHelper.hashTokenSHA256(newToken)

      const updated = await this.userModel.updateOne(
        { _id: userId },
        { $set: { refreshToken: hashToken } }
      );
      if (updated.matchedCount === 0) throw new NotFoundException(`Token expired`);
      if (updated.modifiedCount === 0) this.logger.warn("Refresh token matched but not updated (same value)");
      return true
    } catch (error) {
      this.logger.error(error.message, error.stack);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Something went wrong!');
    }
  }

  async handleLogout(userId: string) {
    try {
      const result = await this.userModel.updateOne({ _id: userId }, { refreshToken: "" })
      if (result.matchedCount === 0) throw new BadRequestException(`Logout fail!`);
      return result;
    } catch (error) {
      this.logger.error(error.message, error.stack);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Something went wrong!');
    }
  }
}
