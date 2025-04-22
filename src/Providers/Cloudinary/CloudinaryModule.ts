import { Module } from '@nestjs/common';
import { CloudinaryProvider } from './CloudinaryProvider';
import { CloudinaryService } from './CloudinaryService';

@Module({
    providers: [CloudinaryProvider, CloudinaryService],
    exports: [CloudinaryProvider, CloudinaryService],
})
export class CloudinaryModule {}
