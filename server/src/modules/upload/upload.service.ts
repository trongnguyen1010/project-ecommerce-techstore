import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import toStream = require('buffer-to-stream');

@Injectable()
export class UploadService {
  async uploadImage(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        { folder: 'techstore_products' }, // Tên thư mục trên Cloud
        (error, result) => {
          if (error) return reject(error);

          if (!result) return reject(new Error('Upload failed: No result returned'))

          resolve(result.secure_url); // Trả về link ảnh HTTPS
        },
      );
      
      toStream(file.buffer).pipe(upload);
    });
  }
}