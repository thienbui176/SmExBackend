import { IsMongoId, IsNotEmpty } from 'class-validator';
import Messages from 'src/Core/Messages/Messages';

export default class TransferHostRequest {
    @IsNotEmpty()
    @IsMongoId({ message: Messages.IS_NOT_MONGO_ID })
    newHostId: string;
}
