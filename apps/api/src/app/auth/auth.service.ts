import { UserService } from '../user/user.service';
import { Inject, Injectable } from '@nestjs/common';
import { compare } from '../utils/bcrypt';
import { Request, Response } from 'express';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthService {
  constructor(@Inject(UserService.name) private readonly userService: UserService) {}

  public logout(req: Request, res: Response): void {
    req.session.destroy(console.error);
    req.logout(console.error);
    res.clearCookie(environment.sessionName);
    res.status(204);
    res.send('');
  }

  async validateUser(username: string, password: string) {
    const user = await this.userService.findOneByUsername(username);

    if (user && (await compare(password, user.password))) {
      return user;
    } else {
      return null;
    }
  }
}
