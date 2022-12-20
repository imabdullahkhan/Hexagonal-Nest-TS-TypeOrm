import { IsNotEmpty, IsString } from 'class-validator';

export class KafkaProduceDto {
  @IsString()
  topic: string;

  @IsNotEmpty()
  message: ProducerMessageDto;
}

class ProducerMessageDto {
  @IsString()
  value: string;

  @IsString()
  eventType: string;
}
