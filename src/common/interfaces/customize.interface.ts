import { AccountType } from "@modules/users/schemas/user.schema";
import { FlattenMaps, Types } from "mongoose";
export interface Response<T> {
    statusCode: number,
    message?: string,
    data: T,
}

export interface PaginatedResult<T> {
    meta: {
        current: number,
        pageSize: number,
        pages: number,
        total: number,
    },
    result: T[],
}

export interface IInfoDecodeAccessToken {
    _id: string,
    name: string,
    email: string,
    role: string,
}