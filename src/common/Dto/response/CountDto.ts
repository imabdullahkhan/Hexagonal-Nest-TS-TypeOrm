import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CountDto {
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 0 })
  count: number;

  constructor(count: number) {
    this.count = count;
  }
}
