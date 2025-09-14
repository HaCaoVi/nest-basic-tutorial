import { BadRequestException, HttpException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Company } from './schemas/company.schema';
import { Model, Types } from 'mongoose';
import type { IInfoDecodeToken, PaginatedResult } from '@common/interfaces/customize.interface';
import { normalizeFilters } from '@common/helpers/convert.helper';

@Injectable()
export class CompaniesService {
  private readonly logger = new Logger(CompaniesService.name);
  constructor(
    @InjectModel(Company.name) private companyModel: Model<Company>,
  ) { }

  async handleCreateCompany(authorId: string, createCompanyDto: CreateCompanyDto) {
    try {
      return this.companyModel.create({ ...createCompanyDto, createdBy: authorId });
    } catch (error) {
      if (error instanceof HttpException) throw error;
      this.logger.error(error.message, error.stack);
      throw new InternalServerErrorException("Something went wrong!");
    }
  }

  async findAll(current = 1, pageSize = 10, filters: Record<string, any> = {}): Promise<PaginatedResult<Company>> {
    try {
      const filter = { isDeleted: false, ...normalizeFilters(filters) };

      const skip = (current - 1) * pageSize;

      const [totalItems, result] = await Promise.all([
        this.companyModel.countDocuments(filter),
        this.companyModel
          .find(filter)
          .skip(skip)
          .limit(pageSize)
          .sort({ createdAt: -1 })
          .populate({
            path: 'createdBy',
            select: '-password -refreshToken',
            options: { lean: true },
          })
          .lean<Company[]>()
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

  async findOne(id: string): Promise<Company> {
    try {
      const company = await this.companyModel.findById(id).select('-password -refreshToken').lean<Company>();
      if (!company) throw new NotFoundException("Company not found!")
      return company;
    } catch (error) {
      this.logger.error(error.message, error.stack);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Something went wrong!');
    }
  }

  async update(author: IInfoDecodeToken, id: string, updateCompanyDto: UpdateCompanyDto) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid company id');
      }
      const updated = await this.companyModel.updateOne({ _id: id }, { ...updateCompanyDto, updatedBy: author._id }, { runValidators: true });
      if (updated.matchedCount === 0) throw new NotFoundException(`Company with id ${id} not found`);
      return updated;
    } catch (error) {
      this.logger.error(error.message, error.stack);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException("Something went wrong!");
    }
  }

  async remove(user: IInfoDecodeToken, id: string) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid company id');
      }
      const deleted = await this.companyModel.updateOne({ _id: id, isDeleted: false }, { deletedAt: new Date(), deletedBy: user._id, isDeleted: true }, { runValidators: true })
      if (deleted.matchedCount === 0) throw new NotFoundException(`Company with id ${id} not found or already deleted`);
      return deleted;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      this.logger.error(error.message, error.stack);
      throw new InternalServerErrorException("Something went wrong!");
    }
  }

  async isCompanyExist(id: string) {
    try {
      return !!(await this.companyModel.exists({ _id: id, isDeleted: false }));
    } catch (error) {
      this.logger.error(error.message, error.stack);
      return false
    }
  }
}