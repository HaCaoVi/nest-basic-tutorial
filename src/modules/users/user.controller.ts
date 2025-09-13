import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './user.service';
import { Public, User } from '@common/decorators/customize.decorator';
import type { IInfoDecodeAccessToken } from '@common/interfaces/customize.interface';
import { ParseObjectIdPipe } from '@common/pipes/parse-objectid.pipe';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  create(
    @User() user: IInfoDecodeAccessToken,
    @Body() createUserDto: any
  ) {
    return this.usersService.create(user, createUserDto);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(
    @User() user: IInfoDecodeAccessToken,
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(user, id, updateUserDto);
  }

  @Delete(':id')
  remove(
    @User() user: IInfoDecodeAccessToken,
    @Param('id', ParseObjectIdPipe) id: string
  ) {
    return this.usersService.remove(user, id);
  }

}
