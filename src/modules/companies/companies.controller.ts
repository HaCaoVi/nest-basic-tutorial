import { Controller, Get, Post, Body, Patch, Param, Delete, Request, Query } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import type { IInfoDecodeToken } from '@common/interfaces/customize.interface';
import { Public, ResponseMessage, User } from '@common/decorators/customize.decorator';
import { ParseObjectIdPipe } from '@common/pipes/parse-objectid.pipe';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) { }

  @Post()
  @ResponseMessage("Created successfully")
  create(
    @User() user: IInfoDecodeToken,
    @Body() createCompanyDto: CreateCompanyDto) {
    return this.companiesService.handleCreateCompany(user._id.toString(), createCompanyDto);
  }

  @Public()
  @Get()
  findAll(
    @Query() query: any
  ) {
    const { current, pageSize, ...filters } = query;
    return this.companiesService.findAll(+current, +pageSize, filters);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.companiesService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage("Updated Successfully")
  update(
    @User() user: IInfoDecodeToken,
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateCompanyDto: UpdateCompanyDto
  ) {
    return this.companiesService.update(user, id, updateCompanyDto);
  }

  @Delete(':id')
  @ResponseMessage("Deleted Successfully")
  remove(
    @User() user: IInfoDecodeToken,
    @Param('id', ParseObjectIdPipe) id: string) {
    return this.companiesService.remove(user, id);
  }
}
