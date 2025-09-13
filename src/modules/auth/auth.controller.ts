import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './passport/jwt-auth.guard';
import { Public, ResponseMessage, User } from '@common/decorators/customize.decorator';
import type { IInfoDecodeAccessToken } from '@common/interfaces/customize.interface';
import { RegisterUserDto } from '@modules/users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Public()
    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@User() user: IInfoDecodeAccessToken) {
        return this.authService.login(user);
    }

    @Public()
    @ResponseMessage("Register Successfully")
    @Post("register")
    async register(@Body() registerUserDto: RegisterUserDto) {
        return this.authService.register(registerUserDto)
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
