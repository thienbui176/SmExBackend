import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString, Length } from 'class-validator';
import { GENDER } from 'src/Constants/Gender';

export default class UserRegisterRequest {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @Length(6, 64)
    password: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @Length(0, 122)
    firstName: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    @Length(0, 122)
    lastName: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsEnum(GENDER)
    gender: GENDER;

    get fullName(): string {
        return this.firstName + ' ' + this.lastName;
    }
}
