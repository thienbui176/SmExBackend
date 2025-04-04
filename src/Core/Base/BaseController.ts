import { AppLogger } from '../Logger/AppLogger';

export default class BaseController {
  protected readonly logger: AppLogger;

  constructor() {
    this.logger = new AppLogger(this.constructor.name);
  }
}
