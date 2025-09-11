import { Request } from "express";
import { User } from "src/modules/users/schemas/user.schema";

export interface AuthenticatedRequest extends Request {
    user: Omit<User, 'password'>;
}