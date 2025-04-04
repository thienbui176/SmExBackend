import { AbstractCrudService } from 'src/Core/Base/AbstractCrudService';
import { User } from './Entity/User';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { AppLogger } from 'src/Core/Logger/AppLogger';

@Injectable()
export class UserService extends AbstractCrudService<User> {
  constructor(@InjectModel(User.name) protected repository: Model<User>) {
    super(repository);
  }
}
