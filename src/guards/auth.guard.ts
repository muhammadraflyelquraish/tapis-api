import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { FirebaseService } from 'src/services/firebase.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private firebase: FirebaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = this.extractTokenFromHeader(request);
    if (!token) throw new UnauthorizedException();

    try {
      const user = await this.firebase.verifyToken(token);
      request.user = user;

      return true;
    } catch (err) {
      throw new UnauthorizedException();
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authorize = request.headers['authorization'];
    if (!authorize) return undefined;

    const [type, token] = authorize.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
