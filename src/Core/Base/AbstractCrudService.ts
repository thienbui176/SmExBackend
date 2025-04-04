import { Model } from 'mongoose';
import BaseService from './BaseService';

export abstract class AbstractCrudService<T> extends BaseService {
    constructor(protected readonly repository: Model<T>) {
        super()
     }

    async findAll(): Promise<T[]> {
        return this.repository.find();
    }

    async findById(id: string): Promise<T | null> {
        return this.repository.findById(id);
    }

    async create(data: Partial<T>): Promise<T> {
        return this.repository.create(data);
    }

    async update(id: string, data: Partial<T>): Promise<T | null> {
        return await this.repository.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(id: string): Promise<null> {
        return await this.repository.findByIdAndDelete(id);
    }
}