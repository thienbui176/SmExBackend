import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import toStream = require('buffer-to-stream');

@Injectable()
export class CloudinaryService {
    async uploadImage(
        file: Express.Multer.File,
    ): Promise<UploadApiResponse | UploadApiErrorResponse> {
        const up = await v2.uploader.upload(file.originalname,{upload_preset: ''})

        return new Promise((resolve, reject) => {
            console.log(file);
            const upload = v2.uploader.upload_stream((error, result) => {
                if (error) return reject(error);
                resolve(result as any);
            });

            toStream(file.buffer).pipe(upload);
        });
    }
}
