import { Entity } from './entity';
export interface User extends Entity {
    username: string;
    displayName: string;
    profilePicPath: string;
    hostname: string;
    admin: boolean;
}