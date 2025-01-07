import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { StartupService } from './startup.service';
import JwtAuthGuard from '../auth/guards/jwt-auth.guard';
import { CreateStartupDto } from './dtos/createStartup.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageService } from '../image/image.service';
import { DataSource } from 'typeorm';
import { Image } from 'src/database/entities/image.entity';
import { UpdateStartupDto } from './dtos/updateStartup.dto';

@Controller('startup')
export class StartupController {
  constructor(
    private readonly startupService: StartupService,
    private readonly imageService: ImageService,
    private readonly dataSource: DataSource
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Req() req,
    @Body() createStartupDto: CreateStartupDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const queryRunner = this.dataSource.createQueryRunner()
    try {
      await queryRunner.connect()
      await queryRunner.startTransaction()

      const newImage: Image = await this.imageService.create(file, queryRunner)
      const newStartup = await this.startupService.create({...createStartupDto,imageId: newImage.id, authorId: req.user.id }, queryRunner)


      await queryRunner.commitTransaction()
      return newStartup
    } catch (error) {
      await queryRunner.rollbackTransaction()
      throw error
    }finally{
      await queryRunner.release()
    }
  }

  @Get()
  getAll(@Query() {query}: {query?:string}){
    return this.startupService.search(query)
  }

  @Get(':id')
  getStartupById(@Param('id') id: string){
    return this.startupService.getStartupById(id)
  }

  @Put(':id')
  update(@Param('id')id: string, @Body() updateStartupDto: UpdateStartupDto){
    return this.startupService.update(id, updateStartupDto)
  }
}
