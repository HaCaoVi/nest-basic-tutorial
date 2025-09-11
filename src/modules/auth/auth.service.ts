
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/user.service';
import { SecurityHelper } from 'src/common/helpers/security.helper';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private securityHelper: SecurityHelper
    ) { }

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findUserByUsername(username);
        if (user) {
            const isValidPassword = await this.securityHelper.comparePassword(pass, user.password);
            if (isValidPassword) return user
        }
        return null;
    }

    async login(user: any) {
        const payload = { username: user.email, sub: user._id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
