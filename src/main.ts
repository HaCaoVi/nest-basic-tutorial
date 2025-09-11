import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from '@modules/auth/passport/jwt-auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const reflector = app.get(Reflector);

  // app.useGlobalGuards(new JwtAuthGuard(reflector));
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    "origin": `${configService.get("FE_ORIGIN_URL")}`,
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "credentials": "true",
  });

  await app.listen(configService.get('PORT') ?? 3000);
}
bootstrap();
