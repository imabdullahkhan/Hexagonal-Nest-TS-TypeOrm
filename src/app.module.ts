import { classes } from '@automapper/classes';
import { CamelCaseNamingConvention } from '@automapper/core';
import { AutomapperModule } from '@automapper/nestjs';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UtilsModule } from './common/utils/UtilsModule';


import { EventEmitterModule } from '@nestjs/event-emitter';
import { ProducerModule } from './common/producers/ProducerModule';
import { LoggerMiddleware } from './common/middlewares/LoggerMiddleware';
import { BaseTestingEntity } from './modules/baseTesting/adapter/database/postgres/orm-entities/BaseTestingEntity';
import { BaseTestingModule } from './modules/baseTesting/BaseTestingModule';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { HttpExceptionFilter } from './common/exception/http.exception';
import { ResponseInterceptor } from './common/middlewares/ResponseInterception';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
      namingConventions: new CamelCaseNamingConvention(),
    }),
    EventEmitterModule.forRoot(),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        name: 'default',
        type: 'postgres',
        database: configService.get('DB_NAME'),
        host: configService.get('DB_HOST'),
        port: Number(configService.get('DB_PORT')),
        username: configService.get('DB_USERNAME'),
        password: String(configService.get('DB_PASSWORD')),
        schema: 'public',
        sid: configService.get('DB_NAME'),
        autoLoadEntities: true,
        entities: [

          BaseTestingEntity,
        ],
        synchronize: false,
        logging: false,
        migrationsTableName: 'warehouse_migrations',
        migrations: [],
      }),
      dataSourceFactory: async (options) => {
        const dataSource = await new DataSource(options).initialize();
        return dataSource;
      },
    }),
    UtilsModule,
    ProducerModule,
    BaseTestingModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },

  ],
})
export class AppModule implements NestModule {
  configure(userContext: MiddlewareConsumer) {
    userContext.apply(LoggerMiddleware).forRoutes('*');
  }
}
