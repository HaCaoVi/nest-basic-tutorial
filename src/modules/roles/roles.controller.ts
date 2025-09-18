import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ResponseMessage, User } from '@common/decorators/customize.decorator';
import type { IInfoDecodeToken } from '@common/interfaces/customize.interface';
import { ParseObjectIdPipe } from '@common/pipes/parse-objectid.pipe';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) { }

  @Post()
  @ResponseMessage("Created Successfully")
  create(
    @User() user: IInfoDecodeToken,
    @Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(user, createRoleDto);
  }

  @Get()
  findAll(
    @Query() query: any
  ) {
    const { current, pageSize, ...filters } = query;
    return this.rolesService.findAll(+current, +pageSize, filters);
  }

  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.rolesService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage("Updated Successfully")
  update(
    @User() user: IInfoDecodeToken,
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateRoleDto: UpdateRoleDto
  ) {
    return this.rolesService.update(user, id, updateRoleDto);
  }

  @Delete(':id')
  @ResponseMessage("Deleted Successfully")
  remove(
    @User() user: IInfoDecodeToken,
    @Param('id', ParseObjectIdPipe) id: string) {
    return this.rolesService.remove(user, id);
  }
}