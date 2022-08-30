import { User } from '@e-exam-workspace/entities';
import { UsersService } from '../../app/users/users.service';
import { PassportSerializer } from "@nestjs/passport";
import { Inject } from '@nestjs/common';

export class SessionSerializer extends PassportSerializer {
    constructor(@Inject(UsersService.name) private readonly userService: UsersService) {
        super();
    }

    serializeUser(user: User, done: (err, user: User) => void) {
        console.log('serializeUser')
        done(null, user);
    }

    async deserializeUser(payload: User, done: (err, user: User) => void) {
        console.log('deserializeUser')
        const user = await this.userService.findOne(payload.id);
        return user ? done(null, user) : done(null, null);
    }
}