import { Body, Controller, Get, Patch, Post, Query } from '@nestjs/common';

export interface UserList {
  name: string;
  surname: string;
  email: string;
  password: string;
  phone: string;
  age: string;
  country: string;
  district: string;
  role: string;
}

@Controller('users')
export class UserController {
  @Get()
  async getAllUsers(
    @Query('page') page: string,
    @Query('pageSize') pageSize: string,
    @Query('search') search?: string,
  ) {}

  @Post('save')
  async saveUser(@Body() userData: UserList) {}

  @Get(':id')
  async getUserID(@Query('id') id: string) {}

  @Patch('update')
  async updateUser() {}
}
