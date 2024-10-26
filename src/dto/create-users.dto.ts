// create-users.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class CreateUsersDto {
  @ApiProperty({ description: 'Kullanıcının adı', required: true })
  name: string;

  @ApiProperty({ description: 'Kullanıcının soyadı', required: true })
  surname: string;

  @ApiProperty({ description: 'Kullanıcının e-posta adresi', required: true })
  email: string;

  @ApiProperty({ description: 'Kullanıcının şifresi', required: true })
  password: string;

  @ApiProperty({ description: 'Kullanıcının telefon numarası', required: true })
  phone: string;

  @ApiProperty({ description: 'Kullanıcının yaşı', required: true })
  age: number;

  @ApiProperty({ description: 'Kullanıcının ülkesi', required: true })
  country: string;

  @ApiProperty({ description: 'Kullanıcının ilçesi', required: true })
  district: string;

  @ApiProperty({ description: 'Kullanıcının rolü', required: true })
  role: string;
}
