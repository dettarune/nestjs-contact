import { Module } from '@nestjs/common';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { CommonModule } from 'src/common/common.module';
import { Logger } from 'winston';

@Module({
  providers: [UserService, Logger ],
  controllers: [UserController],
})
export class UserModule {}
