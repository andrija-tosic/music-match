import { AuthService } from './auth.service';
import { CreateUserDto } from '@e-exam-workspace/entities';
import { Controller, Post, UseGuards, Body, Inject, ClassSerializerInterceptor, UseInterceptors, UnauthorizedException, Get, Session, Request } from '@nestjs/common';
import { LoginWithCredentialsGuard } from './guards/local-auth.guard';
import { AuthorizeGuard } from './guards/authorize.guard'

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
    constructor(@Inject(AuthService.name) private readonly authService: AuthService) { }

    @Post('login')
    @UseGuards(LoginWithCredentialsGuard)
    async login(@Body() userDto: Pick<CreateUserDto, 'username' | 'password'>) {
        const user = await this.authService.validateUser(userDto.username, userDto.password);

        if (!user) {
            throw new UnauthorizedException();
        }

        return user;
    }

    @Get()
    @UseGuards(AuthorizeGuard)
    getSession(@Request() req) {
        return req.user;
    }
}
