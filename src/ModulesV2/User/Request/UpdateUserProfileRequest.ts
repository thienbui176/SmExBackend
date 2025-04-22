import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
    IsDate,
    IsDateString,
    IsEnum,
    IsNumber,
    IsOptional,
    IsString,
    Length,
} from 'class-validator';
import { GENDER } from 'src/Constants/Gender';

export default class UpdateUserProfileRequest {
    @ApiProperty()
    @IsOptional()
    @IsString()
    fullName: string;

    @ApiProperty({ enum: GENDER, default: GENDER.MALE })
    @IsOptional()
    @IsEnum(GENDER)
    gender: GENDER;

    @ApiProperty()
    @IsOptional()
    @IsString()
    @Length(10, 11)
    phoneNumber: string;

    @ApiProperty()
    @IsOptional()
    @IsDateString()
    dateOfBirth: Date;

    @ApiProperty()
    @IsOptional()
    @IsString()
    address: string;
}
