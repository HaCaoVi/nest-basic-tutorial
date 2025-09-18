import { Model } from "mongoose";

export interface Response<T> {
    statusCode: number,
    message?: string,
    data: T,
}

export interface SoftDeleteModel<T> extends Model<T> {
    softDeleteOne(filter: any, deletedBy?: string): Promise<any>;
    softDeleteMany(filter: any, deletedBy?: string): Promise<any>;
    // restoreOne(filter: any): Promise<any>;
    // restoreMany(filter: any): Promise<any>;
    // findWithDeleted(filter?: any): Promise<T[]>;
    // findOnlyDeleted(filter?: any): Promise<T[]>;
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

export interface IInfoDecodeToken {
    _id: string,
    name: string,
    email: string,
    role: {
        _id: string,
        name: string,
    },
    permissions?: {
        _id: string,
        name: string,
        apiPath: string,
        module: string
    }[],
    sub: string,
    iss: string,
    iat?: number,
    exp?: number
}