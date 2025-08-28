import { Types } from "mongoose"


export enum Role {
    SUPER_ADMIN = "SUPER_ADMIN",
    ADMIN = "ADMIN",
    USER = "USER",
    GUIDE = "GUIDE"
}

export enum Activity {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    BLOCKED = "BLOCKED",
}

export interface IAuthProvider {
    provider: "google" | "credentials",
    providerId: string
}


export interface IUser {
    name?: string,
    email: string,
    password?: string,
    role?: Role,
    phone?: string,
    address?: string,
    isDeleted?: boolean,
    isActive?: Activity,
    isVerified?: boolean,
    auths?: IAuthProvider[],
    booking?: Types.ObjectId[],
    guides?: Types.ObjectId[]
}