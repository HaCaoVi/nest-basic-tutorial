
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/user.service';
import { SecurityHelper } from '@common/helpers/security.helper';
import { IInfoDecodeAccessToken } from '@common/interfaces/customize.interface';
import { RegisterUserDto } from '@modules/users/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';
import ms from 'ms';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private securityHelper: SecurityHelper,
        private configService: ConfigService
    ) { }

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findUserByUsername(username);
        if (user) {
            const isValidPassword = await this.securityHelper.comparePassword(pass, user.password);
            if (isValidPassword) return user
        }
        return null;
    }

    async createRefreshToken(payload: any) {
        return this.jwtService.sign(payload, {
            secret: this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET"),
            expiresIn: this.configService.get<string>("JWT_REFRESH_EXPIRE")
        })
    }

    async login(user: IInfoDecodeAccessToken, res: Response) {
        const { _id, email, name, role } = user
        const payload = {
            sub: "Token login",
            iss: "From server",
            _id,
            email,
            name,
            role
        };

        const refresh_token = await this.createRefreshToken(payload);

        await this.usersService.updateUserToken(_id, refresh_token);
        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            maxAge: +ms(this.configService.get<string>("JWT_REFRESH_EXPIRE") as ms.StringValue)
        })
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                _id,
                email,
                name,
                role
            }
        };
    }

    async register(user: RegisterUserDto) {
        return this.usersService.handleRegister(user)
    }
}
