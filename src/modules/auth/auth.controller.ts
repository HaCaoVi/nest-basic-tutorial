import { Body, Controller, Get, Post, Request, Res, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { AuthService } from './auth.service';
import { Cookies, Public, ResponseMessage, User } from '@common/decorators/customize.decorator';
import type { IInfoDecodeToken } from '@common/interfaces/customize.interface';
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
        @User() user: IInfoDecodeToken,
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
        @User() user: IInfoDecodeToken,
    ) {
        const { _id, iat, exp, iss, ...userData } = user;
        return {
            user: userData
        };
    }

    @Get('refresh')
    @ResponseMessage("Refresh Successfully")
    refreshToken(
        @Res({ passthrough: true }) res: Response,
        @Cookies('refresh_token') refreshToken: string
    ) {
        return this.authService.refreshToken(res, refreshToken)
    }

    @Post('logout')
    @ResponseMessage("Logout Successfully")
    async logout(
        @Res({ passthrough: true }) res: Response,
        @User() user: IInfoDecodeToken,
    ) {
        return this.authService.logout(res, user._id)
    }
}
