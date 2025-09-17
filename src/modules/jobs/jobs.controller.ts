import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Public, ResponseMessage, User } from '@common/decorators/customize.decorator';
import type { IInfoDecodeToken } from '@common/interfaces/customize.interface';
import { ParseObjectIdPipe } from '@nestjs/mongoose';

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

  @Public()
  @Get()
  findAll(
    @Query() query: any
  ) {
    const { current, pageSize, ...filters } = query;
    return this.jobsService.findAll(+current, +pageSize, filters);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.jobsService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage("Updated Successfully")
  update(
    @User() user: IInfoDecodeToken,
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateJobDto: UpdateJobDto
  ) {
    return this.jobsService.update(user, id, updateJobDto);
  }

  @Delete(':id')
  @ResponseMessage("Deleted Successfully")
  remove(
    @User() user: IInfoDecodeToken,
    @Param('id', ParseObjectIdPipe) id: string) {
    return this.jobsService.remove(user, id);
  }
}
