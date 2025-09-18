import { BadRequestException, HttpException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import type { IInfoDecodeToken, PaginatedResult } from '@common/interfaces/customize.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Permission } from './schemas/permission.schema';
import type { PermissionModelType } from './schemas/permission.schema';
import { normalizeFilters } from '@common/helpers/convert.helper';

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

  async findAll(current: number, pageSize: number, filters: Record<string, any> = {}): Promise<PaginatedResult<Permission>> {
    try {
      if (!current) current = 1
      if (!pageSize) pageSize = 10

      const { sort, ...filter } = filters

      const skip = (current - 1) * pageSize;

      const [totalItems, result] = await Promise.all([
        this.permissionService.countDocuments(normalizeFilters(filter)),
        this.permissionService
          .find(normalizeFilters(filter))
          .skip(skip)
          .limit(pageSize)
          .sort(sort)
          .lean<Permission[]>()
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

  async findOne(id: string): Promise<Permission> {
    try {
      const permission = await this.permissionService
        .findById(id)
        .lean<Permission>()
        .exec();
      if (!permission) throw new NotFoundException(`Permission with id ${id} not found`);
      return permission;
    } catch (error) {
      this.logger.error(error.message, error.stack);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Something went wrong!');
    }
  }


  async update(user: IInfoDecodeToken, id: string, updatePermissionDto: UpdatePermissionDto) {
    try {
      const dataConfig = { ...updatePermissionDto }
      const updated = await this.permissionService.updateOne({ _id: id }, { ...dataConfig, updatedBy: user._id }, { runValidators: true })
      if (!updated) throw new NotFoundException(`Permission with id ${id} not found`);
      return updated;
    } catch (error) {
      this.logger.error(error.message, error.stack);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Something went wrong!');
    }
  }

  async remove(user: IInfoDecodeToken, id: string) {
    try {
      const result = await this.permissionService.softDeleteOne({ _id: id }, user._id)
      if (result.matchedCount === 0) throw new NotFoundException(`Permission with id ${id} not found`);
      return {
        deleted: "ok"
      };
    } catch (error) {
      this.logger.error(error.message, error.stack);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Something went wrong!');
    }
  }
}
