import { Module } from '@nestjs/common';
import UserModule from './User/UserModule';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({ imports: [UserModule] })
export default class ModuleV2 {}
