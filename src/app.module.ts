import { Module } from '@nestjs/common';
import { UserModule } from './module/users.module';
import { UserService } from './service/users.service';
import { UserController } from './controller/users.controller';

@Module({
  imports: [UserModule],
  controllers: [UserController],
  providers: [UserService],
})
export class AppModule {}
