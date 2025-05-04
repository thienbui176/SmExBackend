import { AbstractCrudService } from 'src/Core/Base/AbstractCrudService';
import { User } from './Entity/User';
import { InjectModel } from '@nestjs/mongoose';
import { Model, RootFilterQuery, UpdateQuery } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import SearchUserByEmailRequest from './Request/SearchUserRequest';
import UpdateProfileUserRequest from './Request/UpdateProfileUserRequest';
import { CloudinaryService } from 'src/Providers/Cloudinary/CloudinaryService';

@Injectable()
export class UserService extends AbstractCrudService<User> {
    constructor(
        @InjectModel(User.name) protected repository: Model<User>,
        private readonly cloudinaryService: CloudinaryService,
    ) {
        super(repository);
    }

    public async getProfile(userId: string) {
        const user = await this.repository.findById(userId).lean();
        if (!user) throw new NotFoundException('Thông tin người dùng không tồn tại.');
        const { password, ...result } = user;
        return result;
    }

    public async searchUser(searchUserRequest: SearchUserByEmailRequest) {
        const filter: RootFilterQuery<User> = {};
        if (searchUserRequest.email) {
            filter.email = searchUserRequest.email;
        }

        const user = await this.repository.find(filter).lean();
        return user;
    }

    public async updateProfileUser(
        userId: string,
        updateProfileUserRequest: UpdateProfileUserRequest,
    ) {
        const user = await this.repository.findById(userId).lean();
        if (user) {
            const update: UpdateQuery<User> = {
                profile: {
                    ...user.profile,
                    ...updateProfileUserRequest,
                },
            };
            const userUpdated = await this.repository.findByIdAndUpdate(userId, update, {
                new: true,
            });

            return userUpdated;
        }
    }

    public async getSomeInfoUser(userId: string) {
        const user = await this.repository.findById(userId).lean();
        if (!user) throw new NotFoundException('Thông tin người dùng không tồn tại.');
        const { password, ...result } = user;
        return result;
    }

    public async updatePhoto(userId: string, file: Express.Multer.File) {
        await this.cloudinaryService.uploadImage(file);
    }

    public async findByEmail(email: string) {
        return await this.repository.findOne({ email }).lean();
    }

    public async findByEmailHavePassword(email: string) {
        return await this.repository.findOne({ email }).select('+password').lean();
    }
}
