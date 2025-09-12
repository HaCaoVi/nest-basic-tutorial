import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './passport/jwt-auth.guard';
import { Public, User } from '@common/decorators/customize.decorator';
import type { IUser } from '@common/interfaces/customize.interface';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Public()
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@User() user: IUser) {
        return this.authService.login(user);
    }

    // @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }

    // @UseGuards(LocalAuthGuard)
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
