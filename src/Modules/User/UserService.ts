import { AbstractCrudService } from 'src/Core/Base/AbstractCrudService';
import { User } from './Entity/User';
import { InjectModel } from '@nestjs/mongoose';
import { Model, RootFilterQuery } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginationRequest } from 'src/Core/Request/PaginationRequest';

@Injectable()
export class UserService extends AbstractCrudService<User> {
    constructor(@InjectModel(User.name) protected repository: Model<User>) {
        super(repository);
    }

    public async getProfile(userId: string) {
        const user = await this.repository.findById(userId).lean();
        if (!user) throw new NotFoundException('Thông tin người dùng không tồn tại.');
        const { password, ...result } = user;
        return result;
    }

    public async findByEmail(email: string) {
        return await this.repository.findOne({ email }).lean();
    }

    public async findByEmailHavePassword(email: string) {
        return await this.repository.findOne({ email }).select('+password').lean();
    }
}
