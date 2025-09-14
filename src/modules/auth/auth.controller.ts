import { Body, Controller, Get, Post, Request, Res, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './passport/jwt-auth.guard';
import { Public, ResponseMessage, User } from '@common/decorators/customize.decorator';
import type { IInfoDecodeAccessToken } from '@common/interfaces/customize.interface';
import { RegisterUserDto } from '@modules/users/dto/create-user.dto';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Public()
    @UseGuards(LocalAuthGuard)
    @Post('login')
    @ResponseMessage("Login Successfully")
    async login(
        @User() user: IInfoDecodeAccessToken,
        @Res({ passthrough: true }) res: Response
    ) {
        return this.authService.login(user, res);
    }

    @Public()
    @ResponseMessage("Register Successfully")
    @Post("register")
    async register(@Body() registerUserDto: RegisterUserDto) {
        return this.authService.register(registerUserDto)
    }

    @Get('account')
    @ResponseMessage("User Information")
    getProfile(
        @User() user: IInfoDecodeAccessToken,
    ) {
        const { _id, iat, exp, iss, ...userData } = user;
        return {
            user: userData
        };
    }

    @Post('logout')
    async logout(@Request() req) {
        return new Promise((resolve, reject) => {
            req.logout({}, (err) => {
                if (err) {
                    return reject({ message: 'Logout failed', error: err });
                }
                resolve({ message: 'Logout success' });
            });
        });
    }
}
