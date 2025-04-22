import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import Profile from './Profile';

export enum USER_STATUS {
    INACTIVE = 'INACTIVE',
    ACTIVE = 'INACTIVE',
    BLOCKED = 'BLOCKED',
}

@Entity({ name: 'USER' })
export class User {
    @PrimaryGeneratedColumn({ name: 'USR_ID' })
    id: number;

    @Column({ unique: true, nullable: false, length: 500, name: 'USR_EMAIL' })
    email: string;

    @Column({ nullable: false, name: 'USR_PW' })
    password: string;

    @Column({ type: 'enum', enum: USER_STATUS, default: USER_STATUS.ACTIVE, name: 'USR_STT' })
    status: USER_STATUS;

    @OneToOne(() => Profile, (profile) => profile.user, { cascade: true })
    @JoinColumn({ name: 'USR_PROFILE_ID' })
    profile: Profile;
}
