import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './Entity/User';
import { Repository } from 'typeorm';
import UpdateUserProfileRequest from './Request/UpdateUserProfileRequest';
import SearchUserByEmailRequest from './Request/SearchUserRequest';
import { CloudinaryService } from 'src/Providers/Cloudinary/CloudinaryService';

@Injectable()
export class UserService {
    private SELECT_USER_NO_PASSWORD = ['user.id', 'user.status', 'user.email', 'user.profile'];

    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        private readonly cloudinaryService: CloudinaryService,
    ) {}

    public async getProfile(userId: number) {
        console.log(userId);
        const user = await this.userRepository
            .createQueryBuilder('user')
            .select(['user.id', 'user.status', 'user.email', 'user.profile'])
            .leftJoinAndSelect('user.profile', 'profile')
            // .where('user.id = :id', { id: 8 })
            .getOne();

        console.log(user);
        if (!user) throw new NotFoundException('Thông tin người dùng không tồn tại.');
        return user;
    }

    public async searchUser(searchUserRequest: SearchUserByEmailRequest) {
        const user = await this.userRepository
            .createQueryBuilder('user')
            .select(this.SELECT_USER_NO_PASSWORD)
            .leftJoinAndSelect('user.profile', 'profile')
            .where('user.email = :email', { email: searchUserRequest.email })
            .getOne();
        if (!user)
            throw new NotFoundException(
                'Không tồn tại người dùng với email ' + searchUserRequest.email,
            );
        return user;
    }

    public async updateProfileUser(
        userId: number,
        updateUserProfileRequest: UpdateUserProfileRequest,
    ) {
        const user = await this.userRepository.findOneBy({ id: userId });
        if (!user) throw new UnauthorizedException('Yêu cầu chưa được xác thực.');

        const queryUpdate = this.userRepository
            .createQueryBuilder()
            .update()
            .set({
                profile: {
                    ...user.profile,
                    ...updateUserProfileRequest,
                },
            })
            .where('id = :id', { id: userId })
            .execute();
        return queryUpdate;
    }

    public async updatePhoto(userId: number, file: Express.Multer.File) {
        await this.cloudinaryService.uploadImage(file);
    }

    public async findByEmail(email: string) {
        return await this.userRepository.findOne({ where: { email } });
    }
}
