import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  app.enableCors({
    origin: configService.get('FRONTEND_URL'), // allow other origin access to API
    credentials: true, //Access-Control-Allow-Credentials: true response header.
  });
  
  await app.listen(configService.get('PORT'));

}
bootstrap();
