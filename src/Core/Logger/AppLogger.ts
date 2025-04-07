// src/common/logger/app.logger.ts
import { Logger, LogLevel } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export class AppLogger extends Logger {
  private logDir: string;

  constructor(context: string) {
    super(context);
    this.logDir = path.join(process.cwd(), 'storages', 'logs');
    this.ensureLogDirectoryExists();
  }

  private ensureLogDirectoryExists() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  private writeToFile(level: LogLevel, message: string) {

    const timestamp = new Date().toISOString();
    const date = timestamp.slice(0, 10);
    const logFile = path.join(this.logDir, `${date}.log`);

    const formatted = `[${timestamp}] ${level.toUpperCase()} ${message}\n`;
    fs.appendFileSync(logFile, formatted, { encoding: 'utf8' });
  }

  log(message: string) {
    super.log(message);
    this.writeToFile('log', message);
  }

  error(message: string, trace?: string) {
    super.error(message, trace);
    this.writeToFile('error', `${message} ${trace || ''}`);
  }

  warn(message: string) {
    super.warn(message);
    this.writeToFile('warn', message);
  }

  debug(message: string) {
    super.debug(message);
    this.writeToFile('debug', message);
  }

  verbose(message: string) {
    super.verbose(message);
    this.writeToFile('verbose', message);
  }
}
