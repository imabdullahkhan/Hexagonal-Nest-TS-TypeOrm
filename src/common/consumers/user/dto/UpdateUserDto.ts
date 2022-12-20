import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './CreateUserDto';
import { IsNotEmpty } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsNotEmpty()
  id: number;
}
