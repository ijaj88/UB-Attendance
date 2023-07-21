import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class ForgotPassword {
  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  @MaxLength(200)
  username: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  Newpassword: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  token: string;

}
