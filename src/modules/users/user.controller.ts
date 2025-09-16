import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './user.service';
import { Public, ResponseMessage, User } from '@common/decorators/customize.decorator';
import type { IInfoDecodeToken } from '@common/interfaces/customize.interface';
import { ParseObjectIdPipe } from '@common/pipes/parse-objectid.pipe';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @ResponseMessage("Created Successfully")
  create(
    @User() user: IInfoDecodeToken,
    @Body() createUserDto: any
  ) {
    return this.usersService.create(user, createUserDto);
  }

  @Get()
  findAll(
    @Query() query: any
  ) {
    const { current, pageSize, ...filters } = query;

    return this.usersService.findAll(current, pageSize, filters);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage("Updated Successfully")
  update(
    @User() user: IInfoDecodeToken,
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(user, id, updateUserDto);
  }

  @Delete(':id')
  @ResponseMessage("Deleted Successfully")
  remove(
    @User() user: IInfoDecodeToken,
    @Param('id', ParseObjectIdPipe) id: string
  ) {
    return this.usersService.remove(user, id);
  }

}
