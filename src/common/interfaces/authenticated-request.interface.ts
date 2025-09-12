import { Request } from "express";
export interface AuthenticatedRequest extends Request {
    user: IUser;
}

export interface IUser {
    _id: string,
    name: string,
    email: string,
    role: string
}