import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { ResponseMessage, User } from '@common/decorators/customize.decorator';
import type { IInfoDecodeToken } from '@common/interfaces/customize.interface';

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
  findAll() {
    return this.permissionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.permissionsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePermissionDto: UpdatePermissionDto) {
    return this.permissionsService.update(+id, updatePermissionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.permissionsService.remove(+id);
  }
}
