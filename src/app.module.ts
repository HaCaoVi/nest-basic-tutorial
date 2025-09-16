import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from '@modules/users/user.module';
import { AuthModule } from '@modules/auth/auth.module';
import { CompaniesModule } from './modules/companies/companies.module';
import { JobsModule } from '@modules/jobs/jobs.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development.local'],
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>("MONGO_URL")
      }),
      inject: [ConfigService]
    }),
    UsersModule,
    AuthModule,
    CompaniesModule,
    JobsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
