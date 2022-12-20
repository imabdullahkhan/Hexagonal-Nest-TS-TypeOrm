import { Result } from 'src/common/types/result';
import { GetAllBaseTestingDto } from 'src/modules/baseTesting/adapter/dto/GetAllBaseTesting';
import { BaseTestingDomainEntity } from 'src/modules/baseTesting/domain/entities/BaseTesting';

export interface IBaseTestingService {
  getAllBaseTesting(
    queryParam: GetAllBaseTestingDto
  ): Promise<BaseTestingDomainEntity[]>;

  newBaseTesting(
    baseTesting: BaseTestingDomainEntity
  ): Promise<Result<void>>;
}
