import { BadRequestException, HttpException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import type { IInfoDecodeToken } from '@common/interfaces/customize.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Permission } from './schemas/permission.schema';
import type { PermissionModelType } from './schemas/permission.schema';

@Injectable()
export class PermissionsService {
  private readonly logger = new Logger(PermissionsService.name);
  constructor(
    @InjectModel(Permission.name) private permissionService: PermissionModelType,
  ) { }

  async isPermissionExist(apiPath: string, method: string) {
    const check = await this.permissionService.findOne({
      apiPath, method
    })
    if (check) {
      throw new BadRequestException('Permission already exist!');
    }
    return false;
  }

  async create(user: IInfoDecodeToken, createPermissionDto: CreatePermissionDto) {
    try {
      const { apiPath, method } = createPermissionDto;

      await this.isPermissionExist(apiPath, method);

      const permission = await this.permissionService.create({ ...createPermissionDto, createdBy: user._id });
      return {
        _id: permission._id,
        createdAt: permission.createdAt
      }
    } catch (error) {
      this.logger.error(error.message, error.stack);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Something went wrong!');
    }
  }

  findAll() {
    return `This action returns all permissions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} permission`;
  }

  update(id: number, updatePermissionDto: UpdatePermissionDto) {
    return `This action updates a #${id} permission`;
  }

  remove(id: number) {
    return `This action removes a #${id} permission`;
  }
}
