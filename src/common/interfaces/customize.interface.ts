export interface IUser {
    _id: string,
    name: string,
    email: string,
    role: string,
}

export interface PaginatedResult<T> {
    meta: {
        current: number;
        pageSize: number;
        pages: number;
        total: number;
    };
    result: T[];
}