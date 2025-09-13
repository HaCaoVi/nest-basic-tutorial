import { Controller, Get, Post, Body, Patch, Param, Delete, Request, Query } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import type { IInfoDecodeAccessToken } from '@common/interfaces/customize.interface';
import { ResponseMessage, User } from '@common/decorators/customize.decorator';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) { }

  @Post()
  @ResponseMessage("Created successfully")
  create(
    @User() user: IInfoDecodeAccessToken,
    @Body() createCompanyDto: CreateCompanyDto) {
    return this.companiesService.handleCreateCompany(user._id.toString(), createCompanyDto);
  }

  @Get()
  findAll(
    @Query() query: any
  ) {
    const { current, pageSize, ...filters } = query;
    return this.companiesService.findAll(+current, +pageSize, filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companiesService.findOne(id);
  }

  @Patch(':id')
  update(
    @User() user: IInfoDecodeAccessToken,
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto
  ) {
    return this.companiesService.update(user, id, updateCompanyDto);
  }

  @Delete(':id')
  remove(
    @User() user: IInfoDecodeAccessToken,
    @Param('id') id: string) {
    return this.companiesService.remove(user, id);
  }
}
