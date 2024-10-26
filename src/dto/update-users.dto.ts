// update-users.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUsersDto {
  @ApiProperty({ description: 'Kullanıcının adı' })
  name?: string;

  @ApiProperty({ description: 'Kullanıcının soyadı' })
  surname?: string;

  @ApiProperty({ description: 'Kullanıcının e-posta adresi' })
  email?: string;

  @ApiProperty({ description: 'Kullanıcının şifresi' })
  password?: string;

  @ApiProperty({ description: 'Kullanıcının telefon numarası' })
  phone?: string;

  @ApiProperty({ description: 'Kullanıcının yaşı' })
  age?: number;

  @ApiProperty({ description: 'Kullanıcının ülkesi' })
  country?: string;

  @ApiProperty({ description: 'Kullanıcının ilçesi' })
  district?: string;

  @ApiProperty({ description: 'Kullanıcının rolü' })
  role?: string;
}
