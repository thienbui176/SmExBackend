import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model, Types } from 'mongoose';

export type RoomSettingDocument = HydratedDocument<RoomSettings>;

@Schema({ versionKey: false, collection: 'SMEX_RoomSettings' })
export class RoomSettings {
    /** Nhắc nhở ghi chú chi tiêu */
    @Prop({ default: false })
    notifyExpenseNotes: boolean;

    /** Nhắc nhở ghi chú chi tiêu */
    @Prop({ default: false })
    dailyExpenseNotifications: boolean;

    /** Gửi thông báo quyết toán cuối tháng */
    @Prop({ default: false })
    endOfMonthSettlementNotifications: boolean;

    /** Thời gian thông báo tùy chỉnh (nếu cần) */
    @Prop({ default: null })
    customNotificationTime?: Date;

    /** Gửi thông báo tổng kết hàng tuần */
    @Prop({ default: false })
    weeklySummaryNotifications: boolean;

    /** Thông báo khi có cập nhật phòng */
    @Prop({ default: false })
    notifyRoomUpdates: boolean;

    @Prop({ default: null })
    telegramId: string;
}

export const RoomSettingsSchema = SchemaFactory.createForClass(RoomSettings);
