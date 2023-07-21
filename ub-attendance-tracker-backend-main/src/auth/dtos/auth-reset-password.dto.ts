import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class ResetPassword {

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  @MaxLength(200)
  username: string;



}
