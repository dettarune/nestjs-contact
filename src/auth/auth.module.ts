import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from 'src/user/user/user.service';
import { UserModule } from 'src/user/user.module';

@Module({
    imports: [
    JwtModule.register({
    global: true,
    secret: process.env.jwtConstants,
    signOptions: { expiresIn: '30m'},
  }),
  UserModule
],
    providers: [AuthService],
    controllers: [AuthController]},
    
)
export class AuthModule {}
