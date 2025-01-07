import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get('CLOUDINARY_NAME'),
      api_key: this.configService.get('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadPublicFile(file: Express.Multer.File, folder: string) {
    console.log(file.path)
    const results = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
          discard_original_filename: false,
          filename_override: file.originalname,
          type: 'upload'
        },
        (error, results) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            return reject(error);
          }
          resolve(results);
        },
      );
  
      uploadStream.end(file.buffer); // Kết thúc stream với buffer
    });
  
    return {
      key: (results as any).public_id,
      url: (results as any).secure_url,
    };
  }

  async deleteFile(key: string) {
    const result = await cloudinary.uploader.destroy(key);
  }
}
