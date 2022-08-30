import { ExecutionContext, Injectable, CanActivate } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LoginWithCredentialsGuard extends AuthGuard('local') implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const result = (await super.canActivate(context) as boolean);
        await super.logIn(request);
        return result;
    }
}

