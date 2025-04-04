import { Global, Module } from '@nestjs/common';
import { AppLogger } from './AppLogger';

@Global()
@Module({
  providers: [AppLogger],
  exports: [AppLogger],
})
export default class LoggerModule {}
