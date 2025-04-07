import { Type } from 'class-transformer';
import { IsOptional, IsNumber, Min, IsBoolean } from 'class-validator';

export class PaginationRequest {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit: number = 10;

  @IsOptional()
  @IsBoolean()
  getTotal?: boolean;

  get skip(): number {
    return (this.page - 1) * this.limit;
  }
}
