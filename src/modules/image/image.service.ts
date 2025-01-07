import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Image } from 'src/database/entities/image.entity';
import { QueryRunner, Repository } from 'typeorm';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class ImageService {
  folder : string
  constructor(
    @InjectRepository(Image) private readonly imageRepo: Repository<Image>,
    private readonly cloudinaryService: CloudinaryService,
  ) {
    this.folder = 'startup'
  }

  async create(imageFile: Express.Multer.File, queryRunner : QueryRunner){
    const result = await this.cloudinaryService.uploadPublicFile(imageFile, this.folder)
    return queryRunner.manager.save(Image, result)
  }

  async delete(imageId:string, queryRunner: QueryRunner){
    const image: Image = await queryRunner.manager.findOneBy(Image,{id: imageId})
    await this.cloudinaryService.deleteFile(image.key)
    return  queryRunner.manager.delete(Image, imageId)
  }
}
