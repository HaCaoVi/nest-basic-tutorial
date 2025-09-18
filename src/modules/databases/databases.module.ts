import { Module } from '@nestjs/common';
import { DatabasesService } from './databases.service';
import { DatabasesController } from './databases.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@modules/users/schemas/user.schema';
import { Permission, PermissionSchema } from '@modules/permissions/schemas/permission.schema';
import { Role, RoleSchema } from '@modules/roles/schemas/role.schema';
import { SecurityHelper } from '@common/helpers/security.helper';

@Module({
  controllers: [DatabasesController],
  providers: [DatabasesService, SecurityHelper],
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Permission.name, schema: PermissionSchema },
      { name: Role.name, schema: RoleSchema },
    ])
  ],

})
export class DatabasesModule { }