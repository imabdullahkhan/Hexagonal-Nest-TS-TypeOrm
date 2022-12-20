import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty } from 'class-validator';
import { EventDto } from './EventDto';

export class DeleteUserDto extends PartialType(EventDto) {
  @IsNotEmpty()
  id: number;
}
