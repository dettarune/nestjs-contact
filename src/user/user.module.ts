import { Module } from '@nestjs/common';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { CommonModule } from 'src/common/common.module';
import { Logger } from 'winston';
import { MailerService } from 'src/mailer/mailer.service';
import { QrcodeService } from 'src/qrcode/qrcode.service';

@Module({
  providers: [UserService, Logger, MailerService, QrcodeService ],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule {}
