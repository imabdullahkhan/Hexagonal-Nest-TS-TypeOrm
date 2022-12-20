import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseTestingEntity } from '../orm-entities/BaseTestingEntity';
import { IBaseTestingRepository } from 'src/modules/baseTesting/application/ports/output-ports/IBaseTestingRepository';
import { BaseTestingDomainEntity } from 'src/modules/baseTesting/domain/entities/BaseTesting';
export class BaseTestingRepository implements IBaseTestingRepository {
  constructor(
    @InjectRepository(BaseTestingEntity)
    private readonly baseTestingEntityRepo: Repository<BaseTestingEntity>,
    @InjectMapper() private readonly classMapper: Mapper,
  ) { }

  async getAll(conditions: any = {}): Promise<BaseTestingDomainEntity[]> {
    const baseTestingDomainEntityData: BaseTestingEntity[] =
      await this.baseTestingEntityRepo.find({
        where: conditions,
        relations: {},
      });
    const discrepancyItems = this.classMapper.mapArray(
      baseTestingDomainEntityData,
      BaseTestingEntity,
      BaseTestingDomainEntity,
    );
    return discrepancyItems;
  }

  async save(baseTestingItem: BaseTestingDomainEntity): Promise<BaseTestingDomainEntity> {
    const discrepancyItemsEntity: BaseTestingEntity = this.classMapper.map(
      baseTestingItem, //DAta 
      BaseTestingDomainEntity, // SOurce
      BaseTestingEntity, // Des 
    );
    const newDiscrepancyItemsEntity: BaseTestingEntity = await this.baseTestingEntityRepo.save(
      discrepancyItemsEntity,
    );
    return this.classMapper.map(
      newDiscrepancyItemsEntity,
      BaseTestingEntity,
      BaseTestingDomainEntity,
    );
  }
}
