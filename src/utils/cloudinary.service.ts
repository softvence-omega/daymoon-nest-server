import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import fs from 'fs/promises';
import config from '../config/config';

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: config.cloudinary_name,
      api_key: config.cloudinary_api_key,
      api_secret: config.cloudinary_api_secret,
    });
  }

  private async deleteFile(filePath: string) {
    try {
      await fs.access(filePath);
      await fs.unlink(filePath);
    } catch (err: any) {
      console.error(`Error deleting file ${filePath}: ${err}`);
    }
  }

  async uploadImage(name: string, filePath: string, folder = 'profiles'): Promise<UploadApiResponse> {
    try {
      await fs.access(filePath);

      const uploadResult = await cloudinary.uploader.upload(filePath, {
        public_id: `${folder}/${name}-${Date.now()}`,
        resource_type: 'image',
      });

      await this.deleteFile(filePath);
      return uploadResult;
    } catch (error: any) {
      await this.deleteFile(filePath);
      throw new Error(`Image upload failed: ${error}`);
    }
  }
}
