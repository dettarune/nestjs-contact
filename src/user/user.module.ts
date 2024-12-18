import { Module } from '@nestjs/common';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { CommonModule } from 'src/common/common.module';
import { Logger } from 'winston';
import { MailerService } from 'src/mailer/mailer.service';

@Module({
  providers: [UserService, Logger, MailerService ],
  controllers: [UserController],
})
export class UserModule {}
