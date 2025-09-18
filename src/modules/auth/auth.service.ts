
import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/user.service';
import { SecurityHelper } from '@common/helpers/security.helper';
import { IInfoDecodeToken } from '@common/interfaces/customize.interface';
import { RegisterUserDto } from '@modules/users/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';
import ms from 'ms';
import { RolesService } from '@modules/roles/roles.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private securityHelper: SecurityHelper,
        private configService: ConfigService,
        private roleService: RolesService

    ) { }

    async signAccessTokenJWT(payload: IInfoDecodeToken) {
        return this.jwtService.sign(payload)
    }

    async signRefreshTokenJWT(payload: IInfoDecodeToken) {
        return this.jwtService.sign(payload, {
            secret: this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET"),
            expiresIn: this.configService.get<string>("JWT_REFRESH_EXPIRE")
        })
    }

    async verifyRefreshTokenJWT(token: string) {
        return this.jwtService.verify(token, {
            secret: this.configService.get<string>("JWT_REFRESH_TOKEN_SECRET")
        })
    }

    addRefreshTokenInCookie(res: Response, token: string) {
        res.cookie('refresh_token', token, {
            httpOnly: true,
            maxAge: +ms(this.configService.get<string>("JWT_REFRESH_EXPIRE") as ms.StringValue)
        })
    }

    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findUserByUsername(username) as any;
        if (user) {
            const isValidPassword = await this.securityHelper.compareHashBcrypt(pass, user.password);
            if (isValidPassword) {
                const temp = await this.roleService.findOne(user.role._id)

                const permissions = temp?.permissions ?? [];
                const dataObject = { ...user.toObject(), permissions };

                return {
                    user: dataObject
                };
            }
        }
        return null;
    }

    async login(user: any, res: Response) {
        const { _id, email, name, role, permissions } = user.user

        const payload = {
            sub: "Token login",
            iss: "From server",
            _id,
            email,
            name,
            role
        };

        const refresh_token = await this.signRefreshTokenJWT(payload);
        const access_token = await this.signAccessTokenJWT(payload);

        await this.usersService.updateUserToken(_id, refresh_token);

        this.addRefreshTokenInCookie(res, refresh_token)

        return {
            access_token,
            user: {
                _id,
                email,
                name,
                role,
                permissions
            }
        };
    }

    async register(user: RegisterUserDto) {
        return this.usersService.handleRegister(user)
    }

    async refreshToken(res: Response, currentRefreshToken: string) {
        try {
            const user = await this.verifyRefreshTokenJWT(currentRefreshToken)

            const { _id, email, name, role } = user

            await this.usersService.isRefreshTokenValid(_id, currentRefreshToken)

            const payload = {
                sub: "Token login",
                iss: "From server",
                _id,
                email,
                name,
                role,
            };

            const newRefreshToken = await this.signRefreshTokenJWT(payload);
            const access_token = await this.signAccessTokenJWT(payload);
            const temp = await this.roleService.findOne(role._id)

            await this.usersService.updateRefreshToken(_id, newRefreshToken);
            this.addRefreshTokenInCookie(res, newRefreshToken)

            return {
                access_token,
                user: {
                    _id,
                    email,
                    name,
                    role,
                    permissions: temp?.permissions ?? []
                }
            };
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new BadRequestException('Token invalid, please login again!');
        }
    }

    async logout(res: Response, userId: string) {
        try {
            res.clearCookie("refresh_token")
            return this.usersService.handleLogout(userId)
        } catch (error) {
            if (error instanceof HttpException) throw error;
            throw new BadRequestException('Token invalid, please login again!');
        }
    }
}
