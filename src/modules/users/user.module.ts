import { Module } from '@nestjs/common';
import { UsersService } from './user.service';
import { UsersController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { SecurityHelper } from '@common/helpers/security.helper';
import { CompaniesModule } from '@modules/companies/companies.module';

@Module({
  imports: [
    CompaniesModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService, SecurityHelper],
  exports: [UsersService]
})
export class UsersModule { }
