import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
    JwtModule.register({
    global: true,
    secret: process.env.jwtConstants,
    signOptions: { expiresIn: '30m'},
  })
]}
    
)
export class AuthModule {}
