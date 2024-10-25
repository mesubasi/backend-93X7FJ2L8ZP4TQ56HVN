import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
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
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
    @Query('search') search?: string,
  ) {
    try {
      const result = await this.userService.getUsersForPagination(
        page,
        pageSize,
        search,
      );
      return result;
    } catch (err) {
      throw new HttpException(
        'Verileri Çağrılırken Bir Sorun Oluştu!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

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
  async getUserID(@Param('id') id: string) {
    try {
      const user = await this.userService.getOnlyUser(id);
      return user;
    } catch (err) {
      throw new HttpException(
        'Kullanıcı getirilirken bir hata oluştu!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('update/:id')
  async updateUser(@Param('id') id: string, @Body() userData: UserList) {
    try {
      const result = await this.userService.updateUser(id, userData);
      return result;
    } catch (err) {
      throw new HttpException(
        'Veri güncellenirken bir hata oluştu!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
