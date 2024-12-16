import { Module } from '@nestjs/common';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { CommonModule } from 'src/common/common.module';

@Module({
  controllers: [UserController],
  providers: [UserService ]
})
export class UserModule {}
