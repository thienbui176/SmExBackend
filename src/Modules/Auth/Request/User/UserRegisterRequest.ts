import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString, Length } from 'class-validator';
import { GENDER } from 'src/Constants/Gender';

export default class UserRegisterRequest {
    @ApiProperty({ example: 'thienbuiduy.work@gmail.com' })
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;

    @ApiProperty({ example: '123456' })
    @IsNotEmpty()
    @IsString()
    @Length(6, 64)
    password: string;

    @ApiProperty({ example: 'Bui' })
    @IsNotEmpty()
    @IsString()
    @Length(0, 122)
    firstName: string;

    @ApiProperty({ example: 'Thien' })
    @IsNotEmpty()
    @IsString()
    @Length(0, 122)
    lastName: string;

    @ApiProperty({ example: 'Male' })
    @IsNotEmpty()
    @IsEnum(GENDER)
    gender: GENDER;

    get fullName(): string {
        return this.firstName + ' ' + this.lastName;
    }
}
