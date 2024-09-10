import type { EAccountStatus } from '~/enums/AccountStatus';
import type { EUserRole } from '~/enums/EUserRole';


export interface IUser {
    id: number;
    name: string;
    phone_number: string;
    email: string;
    avatar?: string | null;
    address?: string | null;
    role: EUserRole;
    status: EAccountStatus;
    birthday?: string | null;
    email_verified_at?: Date | null;
    password: string;
    rememberToken?: string | null;
    created_at?: Date;
    updated_at?: Date;
}

