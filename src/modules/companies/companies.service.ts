import { BadRequestException, HttpException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Company } from './schemas/company.schema';
import { Model, Types } from 'mongoose';
import { IUser } from '@common/interfaces/customize.interface';

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

  findAll() {
    return `This action returns all companies`;
  }

  findOne(id: number) {
    return `This action returns a #${id} company`;
  }

  async update(author: IUser, id: string, updateCompanyDto: UpdateCompanyDto) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid company id');
      }
      const updated = await this.companyModel.findByIdAndUpdate(id, { ...updateCompanyDto, updatedBy: author._id }, { new: true });
      if (!updated) throw new NotFoundException(`Company with id ${id} not found`);
      return updated;
    } catch (error) {
      this.logger.error(error.message, error.stack);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException("Something went wrong!");
    }
  }

  async remove(user: IUser, id: string) {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new BadRequestException('Invalid company id');
      }
      const deleted = await this.companyModel.findOneAndUpdate({ _id: id, isDeleted: false }, { deletedAt: new Date(), deletedBy: user._id, isDeleted: true }, { new: true })
      if (!deleted) throw new NotFoundException(`Company with id ${id} not found or already deleted`);
      return deleted;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      this.logger.error(error.message, error.stack);
      throw new InternalServerErrorException("Something went wrong!");
    }
  }
}
