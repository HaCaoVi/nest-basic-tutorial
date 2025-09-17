import { HttpException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Resume } from './schemas/resume.schema';
import type { ResumeModelType } from './schemas/resume.schema';
import { IInfoDecodeToken } from '@common/interfaces/customize.interface';

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

  findAll() {
    return `This action returns all resumes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} resume`;
  }

  update(id: number, updateResumeDto: UpdateResumeDto) {
    return `This action updates a #${id} resume`;
  }

  remove(id: number) {
    return `This action removes a #${id} resume`;
  }
}
