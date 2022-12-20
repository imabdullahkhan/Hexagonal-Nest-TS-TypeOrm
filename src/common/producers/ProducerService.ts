import { Inject, Injectable } from '@nestjs/common';
import { Producer } from '@nestjs/microservices/external/kafka.interface';
import { KAFKA_PRODUCER } from 'src/common/constants';
import { KafkaProduceDto } from './dto/KafkaServiceDto';

@Injectable()
export class ProducerService {
  // constructor(@Inject(KAFKA_PRODUCER) private kafkaProducer: Producer) {}
  constructor() {}
  sendKafkaEvent(produceDto: KafkaProduceDto, key: number) {
    // this.kafkaProducer.send({
    //   topic: produceDto.topic,
    //   messages: [
    //     {
    //       key: String(key),
    //       value: JSON.stringify(produceDto.message),
    //     },
    //   ],
    // });
  }

  createKafkaMessage(topic: string, eventType: string, key: number, data: any) {
    // if (Array.isArray(data)) {
    //   for (const item of data) {
    //     const produceDto: KafkaProduceDto = {
    //       topic: topic,
    //       message: {
    //         eventType: eventType,
    //         value: { ...item },
    //       },
    //     };
    //     this.sendKafkaEvent(produceDto, key);
    //   }
    // } else {
    //   const produceDto: KafkaProduceDto = {
    //     topic: topic,
    //     message: {
    //       eventType: eventType,
    //       value: { ...data },
    //     },
    //   };
    //   this.sendKafkaEvent(produceDto, key);
    // }
  }
}
