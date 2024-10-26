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
import {
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
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

@ApiTags('Kullanıcı İşlemleri')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({
    summary:
      'Kullanıcıları Sayfa, Sayfa Numarası ve Search Parametresiyle Getir',
  })
  @ApiResponse({ status: 200, description: 'Kullanıcılar Başarıyla Getirildi' })
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
      return await this.userService.getUsersForPagination(
        page,
        pageSize,
        search,
      );
    } catch (err) {
      throw new HttpException(
        'Verileri Çağrılırken Bir Sorun Oluştu!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('save')
  @ApiOperation({ summary: 'Yeni Kullanıcı Oluştur' })
  @ApiResponse({ status: 201, description: 'Kullanıcı Başarıyla Oluşturuldu.' })
  @ApiResponse({ status: 409, description: 'Bu Email Adresi Kullanımda!' })
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
  @ApiOperation({ summary: 'Varolan Kullanıcıyı ID Numarasıyla Getir' })
  @ApiResponse({ status: 200, description: 'Kullanıcı Başarıyla Getirildi' })
  @ApiResponse({ status: 400, description: 'Böyle Bir Kullanıcı Bulunamadı!' })
  async getUserID(@Param('id') id: string) {
    try {
      return await this.userService.getOnlyUser(id);
    } catch (err) {
      throw new HttpException(
        'Kullanıcı getirilirken bir hata oluştu!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('update/:id')
  @ApiOperation({ summary: 'Mevcut Kullanıcıyı Güncelle' })
  @ApiResponse({ status: 200, description: 'Kullanıcı Başarıyla Güncellendi!' })
  @ApiResponse({ status: 404, description: 'Kullanıcı Bulunamadı!' })
  @ApiBody({ type: UpdateUsersDto })
  async updateUser(
    @Param('id') id: string,
    @Body() userData: UserList,
    updateUsersDto: UpdateUsersDto,
  ) {
    try {
      return await this.userService.updateUser(id, userData);
    } catch (err) {
      throw new HttpException(
        'Veri güncellenirken bir hata oluştu!',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
