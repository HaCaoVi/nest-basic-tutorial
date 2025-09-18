import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { ResponseMessage, User } from '@common/decorators/customize.decorator';
import type { IInfoDecodeToken } from '@common/interfaces/customize.interface';
import { ParseObjectIdPipe } from '@nestjs/mongoose';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) { }


  @Post()
  @ResponseMessage("Created Successfully")
  create(
    @User() user: IInfoDecodeToken,
    @Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionsService.create(user, createPermissionDto);
  }

  @Get()
  findAll(
    @Query() query: any
  ) {
    const { current, pageSize, ...filters } = query;
    return this.permissionsService.findAll(+current, +pageSize, filters);
  }

  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.permissionsService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage("Updated Successfully")
  update(
    @User() user: IInfoDecodeToken,
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updatePermissionDto: UpdatePermissionDto
  ) {
    return this.permissionsService.update(user, id, updatePermissionDto);
  }

  @Delete(':id')
  @ResponseMessage("Deleted Successfully")
  remove(
    @User() user: IInfoDecodeToken,
    @Param('id', ParseObjectIdPipe) id: string) {
    return this.permissionsService.remove(user, id);
  }
}
