import { Logger } from '@nestjs/common';
import { AppLogger } from '../Logger/AppLogger';

export default class BaseService {
  protected readonly logger: AppLogger;

  constructor() {
    this.logger = new AppLogger(this.constructor.name);
  }
}
