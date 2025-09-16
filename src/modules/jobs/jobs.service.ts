import { BadRequestException, HttpException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Job } from './schemas/job.schema';
import type { JobModelType } from './schemas/job.schema';
import { IInfoDecodeToken } from '@common/interfaces/customize.interface';
import { Types } from 'mongoose';
import { CompaniesService } from '@modules/companies/companies.service';
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

      const isCompanyExist = await this.companyService.isCompanyExist(company);

      if (!isCompanyExist) {
        throw new NotFoundException(`Company with id ${company} not found or deleted`);
      }

      const job = await this.jobModel.create({ ...createJobDto, createdBy: user._id });
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

  findAll() {
    return `This action returns all jobs`;
  }

  findOne(id: number) {
    return `This action returns a #${id} job`;
  }

  update(id: number, updateJobDto: UpdateJobDto) {
    return `This action updates a #${id} job`;
  }

  remove(id: number) {
    return `This action removes a #${id} job`;
  }
}
