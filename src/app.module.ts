import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { ContactModule } from './contact/contact.module';
import { UserModule } from './user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [CommonModule, ContactModule, UserModule,
    JwtModule.register({
    global: true,
    secret: process.env.jwtConstants,
    signOptions: { expiresIn: '30s'}
  }),
],
  
  controllers: [],
  providers: [],
})
export class AppModule {}
