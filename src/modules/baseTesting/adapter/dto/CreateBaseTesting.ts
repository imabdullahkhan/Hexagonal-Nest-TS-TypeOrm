import { AutoMap } from '@automapper/classes';
import { Transform } from 'class-transformer';
import { UtilsService } from 'src/common/utils/UtilsService';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateBaseTestingsDto {
  @AutoMap()
  @ApiProperty()
  @Transform(({ value }) => UtilsService.toNumber(value))
  @IsNumber()
  skuId: number;

  @AutoMap()
  @ApiProperty()
  @Transform(({ value }) => UtilsService.toNumber(value))
  @IsNumber()
  qty: number;
}
