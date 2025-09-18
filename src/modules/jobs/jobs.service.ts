import { BadRequestException, HttpException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Job } from './schemas/job.schema';
import type { JobModelType } from './schemas/job.schema';
import { IInfoDecodeToken, PaginatedResult } from '@common/interfaces/customize.interface';
import { Types } from 'mongoose';
import { CompaniesService } from '@modules/companies/companies.service';
import { normalizeFilters } from '@common/helpers/convert.helper';
import { buildPopulateConfigFromStrings } from '@common/helpers/mongoose-populate.helper';
@Injectable()
export class JobsService {
  private readonly logger = new Logger(JobsService.name);
  constructor(
    @InjectModel(Job.name) private jobModel: JobModelType,
    private companyService: CompaniesService,
  ) { }

  async create(user: IInfoDecodeToken, createJobDto: CreateJobDto) {
    try {
      const { company } = createJobDto

      const isCompanyExist = await this.companyService.isCompanyExist(company._id);

      if (!isCompanyExist) {
        throw new NotFoundException(`Company with id ${company} not found or deleted`);
      }

      const job = await this.jobModel.create({ ...createJobDto, company: company._id, createdBy: user._id });
      return {
        _id: job._id,
        createdAt: job.createdAt
      }
    } catch (error) {
      this.logger.error(error.message, error.stack);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Something went wrong!');
    }
  }

  async findAll(current: number, pageSize: number, filters: Record<string, any> = {}): Promise<PaginatedResult<Job>> {
    try {
      if (!current) current = 1
      if (!pageSize) pageSize = 10

      const { sort, populate, fields, ...filter } = filters
      const populateConfig = buildPopulateConfigFromStrings(populate, fields)
      const skip = (current - 1) * pageSize;

      const [totalItems, result] = await Promise.all([
        this.jobModel.countDocuments(normalizeFilters(filter)),
        this.jobModel
          .find(normalizeFilters(filter))
          .skip(skip)
          .limit(pageSize)
          .sort(sort)
          .populate(populateConfig)
          .lean<Job[]>()
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

  async findOne(id: string): Promise<Job> {
    try {
      const job = await this.jobModel
        .findById(id)
        .populate({
          path: 'company',
          options: { lean: true },
        }).lean<Job>();
      if (!job) throw new NotFoundException(`Job with id ${id} not found`);
      return job;
    } catch (error) {
      this.logger.error(error.message, error.stack);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Something went wrong!');
    }
  }

  async update(user: IInfoDecodeToken, id: string, updateJobDto: UpdateJobDto) {
    try {
      const dataConfig = { ...updateJobDto, company: updateJobDto.company._id }
      const updated = await this.jobModel.updateOne({ _id: id }, { ...dataConfig, updatedBy: user._id }, { runValidators: true })
      if (!updated) throw new NotFoundException(`Job with id ${id} not found`);
      return updated;
    } catch (error) {
      this.logger.error(error.message, error.stack);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Something went wrong!');
    }
  }

  async remove(user: IInfoDecodeToken, id: string) {
    try {
      const result = await this.jobModel.softDeleteOne({ _id: id }, user._id)
      if (result.matchedCount === 0) throw new NotFoundException(`Job with id ${id} not found`);
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
