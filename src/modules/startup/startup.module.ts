import { Module } from '@nestjs/common';
import { StartupService } from './startup.service';
import { StartupController } from './startup.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StartUp } from 'src/database/entities/startup.entity';
import { ImageModule } from '../image/image.module';

@Module({
  imports: [TypeOrmModule.forFeature([StartUp]), ImageModule],
  controllers: [StartupController],
  providers: [StartupService],
})
export class StartupModule {}
