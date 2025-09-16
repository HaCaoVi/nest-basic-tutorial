import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { ResponseMessage, User } from '@common/decorators/customize.decorator';
import type { IInfoDecodeToken } from '@common/interfaces/customize.interface';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) { }

  @Post()
  @ResponseMessage("Created Successfully")
  create(
    @User() user: IInfoDecodeToken,
    @Body() createJobDto: CreateJobDto) {
    return this.jobsService.create(user, createJobDto);
  }

  @Get()
  findAll() {
    return this.jobsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobsService.findOne(+id);
  }

  @Patch(':id')
  @ResponseMessage("Updated Successfully")
  update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto) {
    return this.jobsService.update(+id, updateJobDto);
  }

  @Delete(':id')
  @ResponseMessage("Deleted Successfully")
  remove(@Param('id') id: string) {
    return this.jobsService.remove(+id);
  }
}
