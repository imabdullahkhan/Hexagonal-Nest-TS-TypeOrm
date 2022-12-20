import { Inject } from '@nestjs/common';
import { IBaseTestingRepository } from '../ports/output-ports/IBaseTestingRepository';
import { GetAllBaseTestingDto } from '../../adapter/dto/GetAllBaseTesting';
import { BaseTestingDomainEntity } from '../../domain/entities/BaseTesting';
export class BaseTestingService implements IBaseTestingRepository {
  constructor(
    @Inject('IBaseTestingRepository')
    private readonly baseTestingRepository: IBaseTestingRepository,
  ) { }

  async getAll(queryParam: GetAllBaseTestingDto): Promise<BaseTestingDomainEntity[]> {
    let baseTesting = await this.baseTestingRepository.getAll(queryParam);
    return baseTesting;
  }

  async save(baseTestingData: BaseTestingDomainEntity): Promise<BaseTestingDomainEntity> {
    let newBaseTesting = await this.baseTestingRepository.save(baseTestingData);
    return newBaseTesting;
  }

}
