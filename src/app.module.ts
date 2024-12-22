import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { ContactModule } from './contact/contact.module';
import { UserModule } from './user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from './common/prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { MailerService } from './mailer/mailer.service';
import { QrcodeService } from './qrcode/qrcode.service';

@Module({
  imports: [CommonModule, ContactModule, UserModule, AuthModule,
],
  
  controllers: [],
  providers: [PrismaService, MailerService, QrcodeService],
})
export class AppModule {}
