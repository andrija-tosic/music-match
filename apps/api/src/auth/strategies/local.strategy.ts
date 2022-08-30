import { AuthService } from '../auth.service';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-local'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(@Inject(AuthService.name) private readonly authService: AuthService) {
        super({
            usernameField: 'username',
            passwordField: 'password'
        });
    }

    async validate(username: string, password: string) {
        console.log('LocalStrategy.validate()');
        const success = await this.authService.validateUser(username, password);
        if (!success) {
            throw new UnauthorizedException();
        }
    }
}