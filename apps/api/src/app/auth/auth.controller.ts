import { RolesGuard } from './guards/roles.guard';
import { Role } from './../decorators/role.decorator';
import { UserFromSession } from '../decorators/user.decorator';
import { SessionGuard } from './guards/session.guard';
import { AuthService } from './auth.service';
import { CreateUserDto, Roles } from '@music-match/entities';
import {
  Controller,
  Post,
  UseGuards,
  Body,
  Inject,
  ClassSerializerInterceptor,
  UseInterceptors,
  UnauthorizedException,
  Get,
  HttpStatus,
  HttpCode,
  Req,
  Res,
  Logger,
} from '@nestjs/common';
import { SessionLoginGuard } from './guards/session-login.guard';
import { Request, Response } from 'express';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(
    @Inject(AuthService.name) private readonly authService: AuthService
  ) {}

  @Post('login')
  @UseGuards(SessionLoginGuard)
  async login(@Body() userDto: Pick<CreateUserDto, 'username' | 'password'>) {
    const user = await this.authService.validateUser(
      userDto.username,
      userDto.password
    );

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Get('/logout')
  public logout(@Req() req: Request, @Res() res: Response): void {
    this.authService.logout(req, res);
  }

  @Get('session')
  @UseGuards(SessionGuard)
  getUserSession(@UserFromSession() user) {
    // Logger.log('a');
    // Logger.log(user, 'user');
    return user;
  }

  @Get('admin')
  @UseGuards(SessionGuard)
  @UseGuards(RolesGuard)
  @Role(Roles.Admin)
  getAdminSession(@UserFromSession() admin) {
    return admin;
  }
}
