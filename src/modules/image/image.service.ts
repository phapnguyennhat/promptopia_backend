import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Image } from 'src/database/entities/image.entity';
import { QueryRunner, Repository } from 'typeorm';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { FirebaseStorageService } from '../firebase-storage/firebase-storage.service';

@Injectable()
export class ImageService {
  folder : string
  constructor(
    @InjectRepository(Image) private readonly imageRepo: Repository<Image>,
    private readonly firebaseStorageService: FirebaseStorageService
  ) {
    this.folder = 'startup'
  }

  async create(imageFile: Express.Multer.File, queryRunner ?: QueryRunner){
    if(!imageFile){
      throw new BadRequestException('Vui long tải file lên')
    }
    const result = await this.firebaseStorageService.uploadFile(imageFile)
    if(queryRunner){

      return queryRunner.manager.save(Image, result)
    }
    return this.imageRepo.save(result)
  }

  async delete(imageId:string, queryRunner?: QueryRunner){
    if(queryRunner){

      const image: Image = await queryRunner.manager.findOneBy(Image,{id: imageId})
      await this.firebaseStorageService.deleteFile(image.key)
      return  queryRunner.manager.delete(Image, imageId)
    }

    const image: Image = await this.imageRepo.findOneBy({id: imageId})
    await this.firebaseStorageService.deleteFile(image.key)

   
    return this.imageRepo.delete(imageId)
  }
}
