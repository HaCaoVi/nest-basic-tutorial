import { Request } from "express";
import { User } from "@modules/users/schemas/user.schema";

export interface AuthenticatedRequest extends Request {
    user: {
        userId: string,
        username: string
    };
}