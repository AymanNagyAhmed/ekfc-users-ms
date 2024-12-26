import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable, from } from 'rxjs';
import { AuthService } from '@/modules/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '@/modules/users/users.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    @Inject(AuthService) private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const authentication = this.getAuthentication(context);
    
    return from(this.validateToken(authentication, context));
  }

  private async validateToken(token: string, context: ExecutionContext): Promise<boolean> {
    try {
      const payload = this.jwtService.verify(token);
      
      const user = await this.usersService.findOne(payload.userId);
      
      if (!user) {
        throw new UnauthorizedException();
      }

      this.addUser(user, context);
      return true;
    } catch (err) {
      console.error('Token validation error:', err);
      throw new UnauthorizedException();
    }
  }

  private getAuthentication(context: ExecutionContext): string {
    let authentication: string;
    
    if (context.getType() === 'rpc') {
      authentication = context.switchToRpc().getData().Authentication;
    } else if (context.getType() === 'http') {
      const request = context.switchToHttp().getRequest();
      
      // Check both cookie and Authorization header
      authentication = request.cookies?.Authentication || 
                      request.headers.authorization?.replace('Bearer ', '');
      
    }
    
    if (!authentication) {
      throw new UnauthorizedException(
        'No authentication token provided',
      );
    }
    return authentication;
  }

  private addUser(user: any, context: ExecutionContext): void {
    if (context.getType() === 'rpc') {
      context.switchToRpc().getData().user = user;
    } else if (context.getType() === 'http') {
      context.switchToHttp().getRequest().user = user;
    }
  }
}

/**
 * Local authentication guard for handling login
 */
@Injectable()
export class LocalAuthGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { email, password } = request.body;

    const user = await this.usersService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException();
    }

    request.user = user;
    return true;
  }
}