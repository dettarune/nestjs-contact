import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ErrorFilters } from 'src/common/error.filters';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenGuard implements CanActivate {
  constructor(private jwtService: JwtService) { }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const req = context.switchToHttp().getRequest()

    const tokenHeader = req.header('Authorization')

    if (!tokenHeader) {
      throw new UnauthorizedException(`Token Tidak Valid`)
    }
    const token = tokenHeader.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Token Tidak Valid');
    }


    try {
      const decoded = this.jwtService.verify(token)
      req.user = decoded;
      return true
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
