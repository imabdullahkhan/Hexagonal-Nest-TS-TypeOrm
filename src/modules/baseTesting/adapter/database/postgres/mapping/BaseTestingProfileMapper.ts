/* istanbul ignore file */
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { CreateBaseTestingsDto } from '../../../dto/CreateBaseTesting';
import { BaseTestingDomainEntity } from 'src/modules/baseTesting/domain/entities/BaseTesting';
import { BaseTestingEntity } from '../orm-entities/BaseTestingEntity';
@Injectable()
export class BaseTestingMappingProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(mapper, CreateBaseTestingsDto, BaseTestingDomainEntity);
      createMap(mapper, BaseTestingDomainEntity, BaseTestingEntity);
      createMap(mapper, BaseTestingEntity, BaseTestingDomainEntity);
    };
  }
}
