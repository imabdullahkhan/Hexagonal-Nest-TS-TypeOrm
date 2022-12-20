import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class BaseFilteringDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  siteId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  warehouseId: string;
}
