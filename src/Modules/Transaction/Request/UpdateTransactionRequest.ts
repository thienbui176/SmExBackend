import { PartialType } from '@nestjs/swagger';
import CreateTransactionRequest from './CreateTransactionRequest';

export default class UpdateTransactionRequest extends PartialType(CreateTransactionRequest) {}
