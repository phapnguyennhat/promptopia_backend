import {
  BadRequestException,
  Controller,
  Delete,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ImageService } from './image.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post('')
  @UseInterceptors(FileInterceptor('file', {}))
  uploadImage(@UploadedFile('file') file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('Vui lòng tải file ảnh ');
    }
    return this.imageService.create(file);
  }

  @Delete(':id')
  delete(@Param('id')id: string){
    return this.imageService.delete(id)
  }
}
