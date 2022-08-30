import { UsersService } from './../app/users/users.service';
import { Inject, Injectable } from '@nestjs/common';
import { compare } from '../app/utils/bcrypt';

@Injectable()
export class AuthService {
    constructor(@Inject(UsersService.name) private readonly userService: UsersService) { }

    async validateUser(username: string, password: string) {
        const user = await this.userService.findOneByUsername(username);

        if (user && await compare(password, user.password)) {
            console.log('passwords match');
            return user;
        }
        else {
            console.log('passwords don\'t match');
            return null;
        }
    }
}
