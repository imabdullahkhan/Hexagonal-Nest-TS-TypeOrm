
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BaseTestingController } from './adapter/web/BaseTestingController';
import { BaseTestingService } from './application/service/BaseTestingService';
import { BaseTestingEntity } from './adapter/database/postgres/orm-entities/BaseTestingEntity';
import { BaseTestingRepository } from './adapter/database/postgres/repositories/BaseTestingRepository';
import { BaseTestingMappingProfile } from './adapter/database/postgres/mapping/BaseTestingProfileMapper';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BaseTestingEntity,
    ]),
  ],
  controllers: [BaseTestingController],
  providers: [
    {
      provide: 'IBaseTestingService',
      useClass: BaseTestingService,
    },
    {
      provide: 'IBaseTestingRepository',
      useClass: BaseTestingRepository,
    },
    BaseTestingMappingProfile,
  ],
  exports: [
    {
      provide: 'IBaseTestingService',
      useClass: BaseTestingService,
    },
  ],
})
export class BaseTestingModule { }
