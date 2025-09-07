
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import bcrypt from "bcryptjs"

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) { }

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findUserByUsername(username);
        if (user) {
            const isValidPassword = bcrypt.compareSync(pass, user.password);
            if (isValidPassword) return user
        }
        return null;
    }
}
