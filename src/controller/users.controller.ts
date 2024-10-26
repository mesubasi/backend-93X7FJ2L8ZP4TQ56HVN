//users.controller.ts

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
import { ApiBody, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { CreateUsersDto } from 'src/dto/create-users.dto';
import { UpdateUsersDto } from 'src/dto/update-users.dto';

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
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Opsiyonel arama parametresi',
  })
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
  @ApiOperation({ summary: 'Yeni kullanıcı oluşturur' })
  @ApiResponse({ status: 201, description: 'Kullanıcı başarıyla oluşturuldu.' })
  @ApiResponse({ status: 400, description: 'Geçersiz istek' })
  @ApiBody({ type: CreateUsersDto })
  async saveUser(@Body() userData: UserList, createUsersDto: CreateUsersDto) {
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
  @ApiOperation({ summary: 'Mevcut Kullanıcıyı Günceller' })
  @ApiResponse({ status: 200, description: 'Kullanıcı Başarıyla Güncellendi!' })
  @ApiResponse({ status: 400, description: 'Geçersiz İstek' })
  @ApiBody({ type: UpdateUsersDto })
  async updateUser(
    @Param('id') id: string,
    @Body() userData: UserList,
    updateUsersDto: UpdateUsersDto,
  ) {
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
