import { Module } from '@nestjs/common';
import { UserService } from './UserService';
import { UserController } from './UserController';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './Entity/User';

@Module({
    imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService, MongooseModule],
})
export default class UserModule {}
