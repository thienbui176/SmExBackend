import { GENDER } from 'src/Constants/Gender';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';

@Entity({ name: 'PROFILE' })
export default class Profile {
    @PrimaryGeneratedColumn({ name: 'PROFILE_ID' })
    id: number;

    @OneToOne(() => User, (user) => user.profile)
    user: User;

    @Column({ name: 'PROFILE_FN', nullable: false })
    fullName: string;

    @Column({ name: 'PROFILE_GENDER', type: 'enum', enum: GENDER, default: GENDER.OTHER })
    gender: GENDER;

    @Column({ name: 'PROFILE_PHONE', default: null })
    phoneNumber: string;

    @Column({ name: 'PROFILE_DOB', type: 'date', default: null })
    dateOfBirth: Date;

    @Column({ name: 'PROFILE_ADDRESS', default: null })
    address: string;

    @Column({ name: 'PROFILE_PHOTO', default: null })
    photo: string;
}
