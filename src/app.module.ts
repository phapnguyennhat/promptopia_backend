import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { validationSchema } from '../env';
import { AuthorModule } from './modules/author/author.module';
import LogsMiddleware from './utils/logs.middleware';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from '../all-exception.filter';
import { AuthModule } from './modules/auth/auth.module';
import { GoogleAuthModule } from './modules/google-auth/google-auth.module';
import { StartupModule } from './modules/startup/startup.module';
import { CloudinaryModule } from './modules/cloudinary/cloudinary.module';
import { ImageModule } from './modules/image/image.module';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      validationSchema: validationSchema,
      isGlobal: true,
    }),
    AuthorModule,
    AuthModule,
    GoogleAuthModule,
    StartupModule,
    CloudinaryModule,
    ImageModule,
  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_FILTER,
      useClass :AllExceptionsFilter
    }
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogsMiddleware).forRoutes('*');
  }
}
