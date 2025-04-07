import { PERMISSIONS } from '@modules/admin/entities/admin.entity';
import { Request } from 'express';

declare module 'express' {
    export interface Request {
        user: {
            sub: string;
            email: string;
        };
    }
}
