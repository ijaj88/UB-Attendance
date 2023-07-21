import { ApiProperty } from '@nestjs/swagger';

export class CSVUploadDto {
  @ApiProperty({ type: 'string', format: 'binary', required: true })
  file: Express.Multer.File;
}
