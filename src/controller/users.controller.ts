import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UserService } from '../service/users.service';

export interface UserList {
  name: string;
  surname: string;
  email: string;
  password: string;
  phone: number;
  age: number;
  country: string;
  district: string;
  role: string;
}

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUsers(
    @Query('page') page: string,
    @Query('pageSize') pageSize: string,
    @Query('search') search?: string,
  ) {}

  @Post('save')
  async saveUser(@Body() userData: UserList) {
    try {
      return await this.userService.createUser(userData);
    } catch (err) {
      console.log("DB'ye eklenirken bir hata oluştu!", err);
      throw new HttpException(
        'Kullanıcı eklenirken hata oluştu.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async getUserID(@Query('id') id: string) {}

  @Patch('update')
  async updateUser() {}
}
