import { GetAllBaseTestingDto } from 'src/modules/baseTesting/adapter/dto/GetAllBaseTesting';
import { BaseTestingDomainEntity } from 'src/modules/baseTesting/domain/entities/BaseTesting';

export interface IBaseTestingRepository {
  getAll(queryParam: GetAllBaseTestingDto): Promise<BaseTestingDomainEntity[]>;
  save(DiscrepancyItems: BaseTestingDomainEntity): Promise<BaseTestingDomainEntity>;
}
