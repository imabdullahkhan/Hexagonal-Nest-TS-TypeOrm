import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { EventDto } from './EventDto';
import { PartialType } from '@nestjs/mapped-types';

export class CreateUserDto extends PartialType(EventDto) {
  @IsNumber({ maxDecimalPlaces: 0 })
  userId: number;

  @IsNumber({ maxDecimalPlaces: 0 })
  siteId: number;

  @IsNumber({ maxDecimalPlaces: 0 })
  warehouseId: number;

  @IsNumber({ maxDecimalPlaces: 0 })
  roleId: number;

  @IsString()
  roleSlug: string;

  @IsString()
  name: string;
}
