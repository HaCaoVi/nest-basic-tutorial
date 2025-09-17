import { HttpException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Resume } from './schemas/resume.schema';
import type { ResumeModelType } from './schemas/resume.schema';
import { IInfoDecodeToken, PaginatedResult } from '@common/interfaces/customize.interface';
import { normalizeFilters } from '@common/helpers/convert.helper';

@Injectable()
export class ResumesService {
  private readonly logger = new Logger(ResumesService.name);
  constructor(
    @InjectModel(Resume.name) private resumeModel: ResumeModelType,
  ) { }


  async create(author: IInfoDecodeToken, createResumeDto: CreateResumeDto) {
    try {
      const resume = await this.resumeModel.create(
        {
          ...createResumeDto,
          email: author.email,
          user: author._id,
          createdBy: author._id,
          history: [
            {
              status: "PENDING",
              updatedAt: new Date,
              updatedBy: author._id
            }
          ]
        });
      return {
        id: resume._id,
        createdAt: resume.createdAt
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      this.logger.error(error.message, error.stack);
      throw new InternalServerErrorException("Something went wrong!");
    }
  }

  async findAll(current: number, pageSize: number, filters: Record<string, any> = {}): Promise<PaginatedResult<Resume>> {
    try {
      if (!current) current = 1
      if (!pageSize) pageSize = 10

      const { sort, ...filter } = filters

      const skip = (current - 1) * pageSize;

      const [totalItems, result] = await Promise.all([
        this.resumeModel.countDocuments(normalizeFilters(filter)),
        this.resumeModel
          .find(normalizeFilters(filter))
          .skip(skip)
          .limit(pageSize)
          .sort(sort)
          .populate({
            path: 'createdBy',
            select: '-password -refreshToken',
            options: { lean: true },
          })
          .lean<Resume[]>()
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

  async findOne(id: string): Promise<Resume> {
    try {
      const resume = await this.resumeModel
        .findById(id)
        .populate({
          path: 'createdBy',
          select: '-password -refreshToken',
          options: { lean: true },
        }).lean<Resume>();
      if (!resume) throw new NotFoundException("Company not found!")
      return resume;
    } catch (error) {
      this.logger.error(error.message, error.stack);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Something went wrong!');
    }
  }

  async update(author: IInfoDecodeToken, id: string, updateResumeDto: UpdateResumeDto) {
    try {
      const updated = await this.resumeModel
        .updateOne(
          { _id: id },
          {
            ...updateResumeDto,
            updatedBy: author._id,
            history: [
              {
                status: "PENDING",
                updatedAt: new Date,
                updatedBy: author._id
              }
            ]
          },
          { runValidators: true });
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
      // const deleted = await this.companyModel.updateOne({ _id: id, isDeleted: false }, { deletedAt: new Date(), deletedBy: user._id, isDeleted: true }, { runValidators: true })
      const deleted = await this.resumeModel.softDeleteOne({ _id: id, isDeleted: false }, user._id)
      if (deleted.matchedCount === 0) throw new NotFoundException(`Company with id ${id} not found or already deleted`);
      return deleted;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      this.logger.error(error.message, error.stack);
      throw new InternalServerErrorException("Something went wrong!");
    }
  }
}
