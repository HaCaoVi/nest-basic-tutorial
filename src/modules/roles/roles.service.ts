import { BadRequestException, HttpException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Role } from './schemas/role.schema';
import type { RoleModelType } from './schemas/role.schema';
import { IInfoDecodeToken, PaginatedResult } from '@common/interfaces/customize.interface';
import { normalizeFilters } from '@common/helpers/convert.helper';

@Injectable()
export class RolesService {
  private readonly logger = new Logger(RolesService.name);
  constructor(
    @InjectModel(Role.name) private roleModel: RoleModelType,
  ) { }

  async create(user: IInfoDecodeToken, createRoleDto: CreateRoleDto) {
    try {
      const { name } = createRoleDto
      const checkNameExist = await this.roleModel.findOne({ name })
      if (checkNameExist) {
        throw new BadRequestException('Name already exist!');
      }
      const role = await this.roleModel.create({ ...createRoleDto, createdBy: user._id });
      return {
        _id: role._id,
        createdAt: role.createdAt
      }
    } catch (error) {
      this.logger.error(error.message, error.stack);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Something went wrong!');
    }
  }

  async findAll(current: number, pageSize: number, filters: Record<string, any> = {}): Promise<PaginatedResult<Role>> {
    try {
      if (!current) current = 1
      if (!pageSize) pageSize = 10

      const { sort, ...filter } = filters

      const skip = (current - 1) * pageSize;

      const [totalItems, result] = await Promise.all([
        this.roleModel.countDocuments(normalizeFilters(filter)),
        this.roleModel
          .find(normalizeFilters(filter))
          .skip(skip)
          .limit(pageSize)
          .sort(sort)
          .populate({
            path: 'permissions',
            options: { lean: true },
          })
          .lean<Role[]>()
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

  async findOne(id: string): Promise<Role> {
    try {
      const role = await this.roleModel
        .findById(id)
        .populate({
          path: 'permissions',
          options: { lean: true },
        }).lean<Role>();
      if (!role) throw new NotFoundException(`Role with id ${id} not found`);
      return role;
    } catch (error) {
      this.logger.error(error.message, error.stack);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Something went wrong!');
    }
  }

  async update(user: IInfoDecodeToken, id: string, updateRoleDto: UpdateRoleDto) {
    try {
      const dataConfig = { ...updateRoleDto }
      const updated = await this.roleModel.updateOne({ _id: id }, { ...dataConfig, updatedBy: user._id }, { runValidators: true })
      if (!updated) throw new NotFoundException(`Role with id ${id} not found`);
      return updated;
    } catch (error) {
      this.logger.error(error.message, error.stack);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Something went wrong!');
    }
  }

  async remove(user: IInfoDecodeToken, id: string) {
    try {
      const checkRole = await this.roleModel.findById(id);

      if (checkRole?.name === "ADMIN") {
        throw new BadRequestException("Can't delete role admin")
      }

      const result = await this.roleModel.softDeleteOne({ _id: id }, user._id)
      if (result.matchedCount === 0) throw new NotFoundException(`Role with id ${id} not found`);
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