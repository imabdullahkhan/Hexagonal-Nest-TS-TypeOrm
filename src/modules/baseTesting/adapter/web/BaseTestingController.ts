import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import {
  Controller,
  Post,
  Res,
  Get,
  Inject,
  Query,
  Body,
} from '@nestjs/common';
import { Response } from 'express';


import { BaseController } from 'src/common/web/BaseController';
import { IBaseTestingRepository } from '../../application/ports/output-ports/IBaseTestingRepository';
import { CreateBaseTestingsDto } from '../dto/CreateBaseTesting';
import { BaseTestingDomainEntity } from '../../domain/entities/BaseTesting';
import { CustomError } from 'src/common/types/error';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('baseTesting')
@Controller('/base-testing')
export class BaseTestingController extends BaseController {
  constructor(
    @Inject('IBaseTestingRepository')
    private baseTestingService: IBaseTestingRepository,
    @InjectMapper() private readonly classMapper: Mapper,
  ) {
    super();
  }

  @Get()
  public async getAllDiscrepancyItems(@Query() query, @Res() res: Response) {
    let discrepancyItems =
      await this.baseTestingService.getAll(query);

    return this.success(discrepancyItems, res);
  }

  @Post()
  public async createBaseTesting(
    @Body() body: CreateBaseTestingsDto,
    @Res() res: Response,
  ): Promise<any> {
    const discrepancyItem = this.classMapper.map(
      body,
      CreateBaseTestingsDto,
      BaseTestingDomainEntity,
    );
    let result = await this.baseTestingService.save(discrepancyItem);

    if (result) {
      return this.success(result, res);
    }
    return this.sendError(new CustomError('ERROR', 5055), res);

  }
}
