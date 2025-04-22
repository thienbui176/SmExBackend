import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './Entity/User';
import { UserController } from './UserController';
import { UserService } from './UserService';
import { CloudinaryModule } from 'src/Providers/Cloudinary/CloudinaryModule';
import { CloudinaryService } from 'src/Providers/Cloudinary/CloudinaryService';

@Module({
    imports: [TypeOrmModule.forFeature([User]), CloudinaryModule],
    providers: [UserService, CloudinaryService],
    controllers: [UserController],
    exports: [TypeOrmModule],
})
export default class UserModule {}
