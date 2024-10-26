// create-users.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class CreateUsersDto {
  @ApiProperty({
    example: 'john',
    description: 'Kullanıcının adı',
    required: true,
  })
  name: string;

  @ApiProperty({
    example: 'doe',
    description: 'Kullanıcının soyadı',
    required: true,
  })
  surname: string;

  @ApiProperty({
    example: 'johndoe@example.com',
    description: 'Kullanıcının e-posta adresi',
    required: true,
  })
  email: string;

  @ApiProperty({
    example: '123456',
    description: 'Kullanıcının şifresi',
    required: true,
  })
  password: string;

  @ApiProperty({
    example: '5554443322',
    description: 'Kullanıcının telefon numarası',
    required: true,
  })
  phone: string;

  @ApiProperty({
    example: 23,
    description: 'Kullanıcının yaşı',
    required: true,
  })
  age: number;

  @ApiProperty({
    example: 'Germany',
    description: 'Kullanıcının ülkesi',
    required: true,
  })
  country: string;

  @ApiProperty({
    example: 'Berlin',
    description: 'Kullanıcının ilçesi',
    required: true,
  })
  district: string;

  @ApiProperty({
    example: 'user',
    description: 'Kullanıcının rolü',
    required: true,
  })
  role: string;
}
