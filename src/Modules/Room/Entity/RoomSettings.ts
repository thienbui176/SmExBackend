import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model, Types } from 'mongoose';

export type RoomSettingDocument = HydratedDocument<RoomSettings>;

@Schema({ versionKey: false, collection: 'SMEX_RoomSettings' })
export class RoomSettings {
    @Prop({ type: [String], default: [] })
    categoriesOfExpense: string[];

    /** Nhắc nhở ghi chú chi tiêu (7h) */
    @Prop({ default: false })
    notifyExpenseNotes: boolean;

    /** Gửi thông báo quyết toán khi được tạo */
    @Prop({ default: false })
    createdSettlementNotifications: boolean;

    /** Gửi thông báo tổng kết hàng tuần */
    @Prop({ default: false })
    weeklySummaryNotifications: boolean;

    @Prop({ default: null })
    telegramId: string;
}

export const RoomSettingsSchema = SchemaFactory.createForClass(RoomSettings);
