import { PrimaryGeneratedColumn } from 'typeorm';

export abstract class MySqlBaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
}
