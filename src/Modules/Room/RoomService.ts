import {
    BadRequestException,
    ForbiddenException,
    Inject,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { UserService } from '../User/UserService';
import { Room } from './Entity/Room';
import CreateRoomRequest from './Request/CreateRoomRequest';
import Messages from 'src/Core/Messages/Messages';
import { USER_STATUS } from '../User/Entity/User';
import { Model, RootFilterQuery, Types } from 'mongoose';
import { AbstractCrudService } from 'src/Core/Base/AbstractCrudService';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationRequest } from 'src/Core/Request/PaginationRequest';
import InviteMemberRequest from './Request/InviteMemberRequest';
import UpdateRoomRequest from './Request/UpdateRoomRequest';

@Injectable()
export default class RoomService extends AbstractCrudService<Room> {
    MIN_LENGTH_INVITEES = 0;

    constructor(
        @InjectModel(Room.name) protected readonly repository: Model<Room>,
        @Inject(UserService) private readonly userService: UserService,
    ) {
        super(repository);
    }

    /**
     *
     * @param creatorId id người tạo phòng => làm chủ phòng
     * @param createRoomRequest payload tạo phòng
     * @returns
     */
    public async createRoom(
        creatorId: string,
        createRoomRequest: CreateRoomRequest,
    ): Promise<Room> {
        try {
            const room = new Room();
            room.name = createRoomRequest.name;
            room.description = createRoomRequest.description;
            room.hostId = new Types.ObjectId(creatorId);

            if (createRoomRequest.members) {
                await Promise.all(
                    createRoomRequest.members.map(async (memberId) => {
                        const user = await this.userService.findById(memberId);
                        if (!user) throw new BadRequestException(Messages.MSG_011);
                        if (user.status === USER_STATUS.BLOCKED)
                            throw new BadRequestException(Messages.MSG_012(user.profile?.fullName));
                    }),
                );
                room.members = createRoomRequest.members.map(
                    (memberId) => new Types.ObjectId(memberId),
                );
                /** Thêm chủ phòng vào danh sách thành viên */
                room.members.push(room.hostId);
            }

            const roomCreated = this.repository.create(room);
            return roomCreated;
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }

    /**
     *
     * @param userId id của người dùng lấy danh sách phòng của id đó
     * @param paginationRequest query lấy danh sách theo phân trang
     * @returns
     */
    public async getMyRoomsWithPaginate(userId: string, paginationRequest: PaginationRequest) {
        try {
            // received request and handle filter
            const conditionGetListMyRoom: RootFilterQuery<Room> = {
                members: { $in: [new Types.ObjectId(userId)] },
            };
            return this.paginate(
                paginationRequest,
                (skip, limit) => {
                    return this.repository
                        .find(conditionGetListMyRoom)
                        .skip(skip)
                        .limit(limit)
                        .lean();
                },
                () => this.repository.countDocuments(conditionGetListMyRoom),
            );
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }

    /**
     * @param requesterUserId id người thực hiện thêm thành viên
     * @param roomId id của phòng thực hiện thêm thành viên
     * @param inviteMemberRequest id người được thêm vào phòng
     * @returns
     */
    public async inviteMember(
        requesterUserId: string,
        roomId: string,
        inviteMemberRequest: InviteMemberRequest,
    ) {
        try {
            const room = await this.repository.findById(roomId).lean();
            if (!room) throw new NotFoundException(Messages.MSG_015);

            /**
             * Chỉ kiểm tra là thành viên trong phòng thì mới có quyền thêm thành viên khác vào phòng
             * Có thể xử lí chỉ chủ phòng mới có quyền thêm người khác vào phòng */
            if (room.members.includes(new Types.ObjectId(requesterUserId)))
                throw new ForbiddenException(Messages.MSG_023);

            if (
                !inviteMemberRequest.invitees ||
                inviteMemberRequest.invitees.length === this.MIN_LENGTH_INVITEES
            )
                throw new BadRequestException(Messages.MSG_014);
            await Promise.all(
                inviteMemberRequest.invitees.map(async (memberId) => {
                    const user = await this.userService.findById(memberId);
                    if (!user) throw new BadRequestException(Messages.MSG_011);
                    if (room.members.includes(new Types.ObjectId(memberId)))
                        throw new BadRequestException(Messages.MSG_022);
                }),
            );
            const roomUpdated = await this.repository.findByIdAndUpdate(roomId, {
                members: { $push: [...inviteMemberRequest.invitees] },
            });
            return roomUpdated;
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }

    /**
     *
     * @param requesterUserId id người thực hiện yêu cầu xoá thành viên
     * @param roomId id phòng thực hiện xoá thành viên
     * @param memberIdRemove id thành viên bị xoá
     */
    public async removeMember(requesterUserId: string, roomId: string, memberIdRemove: string) {
        try {
            const room = await this.repository.findById(roomId).lean();
            if (!room) throw new NotFoundException(Messages.MSG_015);

            if (room.hostId !== new Types.ObjectId(requesterUserId))
                throw new ForbiddenException(Messages.MSG_029);

            if (!room.members.includes(new Types.ObjectId(memberIdRemove)))
                throw new BadRequestException(Messages.MSG_025);

            /** Kiểm tra xem member bị xoá có còn nợ hay không? */

            const roomUpdated = await this.repository.findByIdAndUpdate(roomId, {
                $pull: { members: new Types.ObjectId(memberIdRemove) },
            });
            return !!roomUpdated;
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }

    /**
     * @param requesterUserId id người thực hiện yêu cầu cập nhật thông tin phòng
     * @param roomId id phòng thực hiện update
     * @param updateRoomRequest payload thông tin cập nhật thông tin phòng
     * @returns
     */
    public async updateRoom(
        requesterUserId: string,
        roomId: string,
        updateRoomRequest: UpdateRoomRequest,
    ) {
        try {
            const room = await this.repository.findById(roomId).lean();
            if (!room) throw new NotFoundException(Messages.MSG_015);

            if (room.hostId !== new Types.ObjectId(requesterUserId))
                throw new ForbiddenException(Messages.MSG_029);

            const roomUpdated = await this.repository.findByIdAndUpdate(roomId, {
                name: updateRoomRequest.name,
                description: updateRoomRequest.description,
            });
            return roomUpdated;
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }
}
