import { Inject } from '@nestjs/common';
import { IBaseTestingRepository } from '../ports/output-ports/IBaseTestingRepository';
import { GetAllBaseTestingDto } from '../../adapter/dto/GetAllBaseTesting';
import { BaseTestingDomainEntity } from '../../domain/entities/BaseTesting';
import { NotFoundException } from 'src/common/exception/response.exception';
import { IBaseTestingService } from '../ports/in-ports/IBaseTestingService';
import { Result } from 'src/common/types/result';
export class BaseTestingService implements IBaseTestingService {
  constructor(
    @Inject('IBaseTestingRepository')
    private readonly baseTestingRepository: IBaseTestingRepository,
  ) { }

  async newBaseTesting(baseTesting: BaseTestingDomainEntity): Promise<Result<void>> {
    await this.baseTestingRepository.save(baseTesting);
    return Result.ok<void>();
  }

  async getAllBaseTesting(queryParam: GetAllBaseTestingDto): Promise<BaseTestingDomainEntity[]> {
    let baseTesting = await this.baseTestingRepository.getAll(queryParam);
    return baseTesting;
  }


}
