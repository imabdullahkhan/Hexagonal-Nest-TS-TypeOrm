import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';
import { UtilsService } from 'src/common/utils/UtilsService';
import { ApiPropertyOptional } from '@nestjs/swagger';
export class GetAllBaseTestingDto {

  @Transform(({ value }) => UtilsService.toNumber(value))
  @IsNumber()
  @ApiPropertyOptional()
  @IsOptional()
  skuId: number;

  @Transform(({ value }) => UtilsService.toNumber(value))
  @IsNumber()
  @ApiPropertyOptional()
  @IsOptional()
  qty: number;

}
