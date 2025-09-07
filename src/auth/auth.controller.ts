import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './passport/local-auth.guard';
import type { AuthenticatedRequest } from 'src/common/interfaces/authenticated-request.interface';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req: AuthenticatedRequest) {
        return this.authService.login(req.user);
    }


    @UseGuards(LocalAuthGuard)
    @Post('auth/logout')
    async logout(@Request() req: AuthenticatedRequest) {
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
