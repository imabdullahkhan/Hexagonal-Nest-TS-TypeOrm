import { Global, Module } from '@nestjs/common';
import { ClientKafka, ClientsModule, Transport } from '@nestjs/microservices';
import {
  CLIENT_KAFKA,
  CLIENT_KAFKA_ID,
  KAFKA_PRODUCER,
} from 'src/common/constants';
import { ProducerService } from './ProducerService';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot(),
    // ClientsModule.register([
    //   {
    //     name: CLIENT_KAFKA,
    //     transport: Transport.KAFKA,
    //     options: {
    //       client: {
    //         clientId: CLIENT_KAFKA_ID,
    //         brokers: process.env.KAFKA_BORKER.split(','),
    //       },
    //       consumer: {
    //         groupId: 'abc',
    //       },
    //       producer: {
    //         allowAutoTopicCreation: true,
    //       },
    //     },
    //   },
    // ]),
  ],
  providers: [
    ProducerService,
    // {
    //   provide: KAFKA_PRODUCER,
    //   useFactory: async (kafkaClient: ClientKafka) => {
    //     return kafkaClient.connect();
    //   },
    //   // inject: [CLIENT_KAFKA],
    // },
  ],
  exports: [ProducerService],
})
export class ProducerModule {}
