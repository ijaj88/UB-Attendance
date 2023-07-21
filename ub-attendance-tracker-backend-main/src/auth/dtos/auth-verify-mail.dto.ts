import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class TokenVerify {

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  @MaxLength(200)
  username: string;

  @IsNotEmpty()
  @ApiProperty()
  //@MaxLength(200)
  token: string;




}
