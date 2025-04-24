import { Model, QueryOptions, RootFilterQuery } from 'mongoose';
import BaseService from './BaseService';
import { PaginationRequest } from '../Request/PaginationRequest';
import { PaginationResult } from '../Interfaces/PaginationResult';
import { paginate } from '../Utils/Paginate';

export abstract class AbstractCrudService<T> extends BaseService {
    constructor(protected readonly repository: Model<T>) {
        super();
    }

    async create(data: Partial<T>): Promise<T> {
        return (await this.repository.create(data)).toObject();
    }

    async update(id: string, data: Partial<T>): Promise<T | null> {
        return await this.repository.findByIdAndUpdate(id, data, { new: true });
    }

    async updateWhere(
        filter: RootFilterQuery<T>,
        data: Partial<T>,
        options?: QueryOptions<T>,
    ): Promise<T | null> {
        return await this.repository.findOneAndUpdate(filter, data, options);
    }

    async findById(id: string): Promise<T | null> {
        return this.repository.findById(id).lean() as T;
    }

    async findAll(condition: RootFilterQuery<T>): Promise<T[]> {
        return this.repository.find(condition).exec();
    }

    async delete(id: string): Promise<null> {
        return await this.repository.findByIdAndDelete(id);
    }

    async paginate<T>(
        pagination: PaginationRequest,
        getList: (skip: number, limit: number) => Promise<T[]>,
        getTotal: () => Promise<number>,
    ): Promise<PaginationResult<T>> {
        const results = await Promise.all([
            getList(pagination.skip, pagination.limit),
            pagination.getTotal ? getTotal() : null,
        ]);

        return paginate(results, pagination);
    }
}
