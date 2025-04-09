import { Inject, Injectable } from '@nestjs/common';
import { AbstractCrudService } from 'src/Core/Base/AbstractCrudService';
import { InjectModel } from '@nestjs/mongoose';
import { Model, RootFilterQuery, Types } from 'mongoose';
import { PaginationRequest } from 'src/Core/Request/PaginationRequest';
import TransactionHistory from '../Entity/TransactionHistory';

@Injectable()
export default class TransactionHistoryService extends AbstractCrudService<TransactionHistory> {
    constructor(
        @InjectModel(TransactionHistory.name)
        protected readonly repository: Model<TransactionHistory>,
    ) {
        super(repository);
    }

    /**
     *
     * @param transactionId
     * @param paginationRequest
     * @returns
     */
    public async getTransactionHistoryByTransactionIdWithPagination(
        transactionId: string,
        paginationRequest: PaginationRequest,
    ) {
        try {
            const conditionGetTransaction: RootFilterQuery<TransactionHistory> = {
                transactionId,
            };
            return this.paginate(
                paginationRequest,
                (skip, limit) => {
                    return this.repository.find(conditionGetTransaction).skip(skip).limit(limit);
                },
                () => {
                    return this.repository.countDocuments(conditionGetTransaction);
                },
            );
        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }
}
