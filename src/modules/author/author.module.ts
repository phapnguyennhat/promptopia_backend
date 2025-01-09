import { Module } from '@nestjs/common';
import { AuthorService } from './author.service';
import { AuthorController } from './author.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Author } from '../../database/entities/author.entity';
import { StartupModule } from '../startup/startup.module';

@Module({
  imports:[TypeOrmModule.forFeature([Author]), StartupModule],
  controllers: [AuthorController],
  providers: [AuthorService],
  exports: [AuthorService]
})
export class AuthorModule {}
