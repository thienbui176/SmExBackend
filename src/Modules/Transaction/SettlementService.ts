import { AbstractCrudService } from 'src/Core/Base/AbstractCrudService';
import SettlementHistory from './Entity/SettlementHistory';
import { Model, RootFilterQuery, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Transaction } from './Entity/Transaction';
import { Room } from '../Room/Entity/Room';

export default class SettlementService extends AbstractCrudService<SettlementHistory> {
    constructor(
        @InjectModel(SettlementHistory.name)
        protected readonly repository: Model<SettlementHistory>,
    ) {
        super(repository);
    }

    public async calculateSettlement() {
        const transactions: Transaction[] = [];
        const room: Room = new Room()
        
        transactions.forEach((transaction) => {

        })
    }
}
