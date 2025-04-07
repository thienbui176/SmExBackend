import { AbstractCrudService } from 'src/Core/Base/AbstractCrudService';
import { User } from './Entity/User';
import { InjectModel } from '@nestjs/mongoose';
import { Model, RootFilterQuery } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { AppLogger } from 'src/Core/Logger/AppLogger';
import { PaginationRequest } from 'src/Core/Request/PaginationRequest';
import { skip } from 'node:test';

@Injectable()
export class UserService extends AbstractCrudService<User> {
  constructor(@InjectModel(User.name) protected repository: Model<User>) {
    super(repository);
  }

  public findWithPaginate(paginationRequest: PaginationRequest) {
    const conditionGetListUser: RootFilterQuery<User> = {};

    return this.paginate(
      paginationRequest,
      (skip, limit) => {
        return this.repository
          .find(conditionGetListUser)
          .skip(skip)
          .limit(limit)
          .lean();
      },
      () => {
        return this.repository.countDocuments();
      },
    );
  }

  public async findByEmail(email: string) {
    return await this.repository.findOne({ email }).lean();
  }
}
