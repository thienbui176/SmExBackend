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
import { User, USER_STATUS } from '../User/Entity/User';
import { Model, RootFilterQuery, Types } from 'mongoose';
import { AbstractCrudService } from 'src/Core/Base/AbstractCrudService';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationRequest } from 'src/Core/Request/PaginationRequest';
import InviteMemberRequest from './Request/InviteMemberRequest';
import UpdateRoomRequest from './Request/UpdateRoomRequest';
import { checkElementInArrayObjectId } from 'src/Core/Utils/Helpers';

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
            room.host = new Types.ObjectId(creatorId);

            if (createRoomRequest.members) {
                await this.validateMembers(createRoomRequest.members);
                room.members = createRoomRequest.members.map(
                    (memberId) => new Types.ObjectId(memberId),
                );
                /** Thêm chủ phòng vào danh sách thành viên */
                if (!checkElementInArrayObjectId(room.members, creatorId)) {
                    room.members.push(room.host);
                }
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
                        .populate('host')
                        .populate('members')
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
            await this.validateInviteMembers(requesterUserId, roomId, inviteMemberRequest);
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

            if (room.host !== new Types.ObjectId(requesterUserId))
                throw new ForbiddenException(Messages.MSG_029);

            if (!checkElementInArrayObjectId(room.members, memberIdRemove))
                throw new ForbiddenException(Messages.MSG_025);

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

            if (room.host !== new Types.ObjectId(requesterUserId))
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

    /**
     *
     * @param roomId
     * @param userId
     * @returns
     */
    public async getRoomById(roomId: string, userId: string) {
        try {
            const room = await this.repository.findById(roomId).lean();
            if (!room) throw new NotFoundException(Messages.MSG_015);

            if (!checkElementInArrayObjectId(room.members, userId))
                throw new ForbiddenException(Messages.MSG_025);

            return room;
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }

    /**
     *
     * @param roomId
     * @param userId
     * @returns
     */
    public async getDetailRoomById(roomId: string, userId: string) {
        try {
            const room = await this.repository
                .findById(roomId)
                .populate('host', 'profile')
                .populate('members', 'profile')
                .lean();

            if (!room) throw new NotFoundException(Messages.MSG_015);
            if (!room.members.some((user) => user._id.toString() === userId)) {
                throw new ForbiddenException(Messages.MSG_025);
            }

            return room;
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }

    /**
     *
     * @param roomId
     * @param requesterUserId
     * @param newHostId
     * @returns
     */
    public async transferHost(roomId: string, requesterUserId: string, newHostId: string) {
        try {
            const [room, newHost] = await Promise.all([
                this.repository.findById(roomId),
                this.userService.findById(newHostId),
            ]);
            this.validateTransferHost(room, newHost, requesterUserId, newHostId);

            const roomUpdated = await this.repository.findByIdAndUpdate(roomId, {
                host: newHostId,
            });
            return roomUpdated;
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }

    /**
     * @param room
     * @param newHost
     * @param requesterUserId
     * @param newHostId
     */
    private validateTransferHost(
        room: Room | null,
        newHost: User | null,
        requesterUserId: string,
        newHostId: string,
    ) {
        if (!room) throw new NotFoundException(Messages.MSG_015);
        if (!newHost) throw new NotFoundException('Người được sang quyền chủ phòng không tồn tại.');
        if (room.host.toString() !== requesterUserId)
            throw new ForbiddenException(Messages.MSG_029);
        if (!checkElementInArrayObjectId(room.members, newHostId)) {
            throw new BadRequestException(
                'Người được sang quyền chủ phòng không phải là thành viên.',
            );
        }
    }

    /**
     * @param memberIds
     */
    private async validateMembers(memberIds: string[]) {
        await Promise.all(
            memberIds.map(async (memberId) => {
                const user = await this.userService.findById(memberId);
                if (!user) throw new BadRequestException(Messages.MSG_011);
                if (user.status === USER_STATUS.BLOCKED)
                    throw new BadRequestException(Messages.MSG_012(user.profile?.fullName));
            }),
        );
    }

    private async validateInviteMembers(
        requesterUserId: string,
        roomId: string,
        inviteMemberRequest: InviteMemberRequest,
    ) {
        const room = await this.repository.findById(roomId).lean();
        if (!room) throw new NotFoundException(Messages.MSG_015);

        /**
         * Chỉ kiểm tra là thành viên trong phòng thì mới có quyền thêm thành viên khác vào phòng
         * Có thể xử lí chỉ chủ phòng mới có quyền thêm người khác vào phòng */
        if (!checkElementInArrayObjectId(room.members, requesterUserId))
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
                if (checkElementInArrayObjectId(room.members, memberId))
                    throw new BadRequestException(Messages.MSG_022);
            }),
        );
    }
}
