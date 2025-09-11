import { Module } from '@nestjs/common';
import { UsersService } from './user.service';
import { UsersController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { SecurityHelper } from 'src/common/helpers/security.helper';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    SecurityHelper
  ],
  controllers: [UsersController],
  providers: [UsersService, SecurityHelper],
  exports: [UsersService]
})
export class UsersModule { }
