import { Module } from '@nestjs/common';
import { UsersService } from './user.service';
import { UsersController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { SecurityHelper } from '@common/helpers/security.helper';
import { RolesModule } from '@modules/roles/roles.module';

@Module({
  imports: [
    RolesModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService, SecurityHelper],
  exports: [UsersService]
})
export class UsersModule { }
