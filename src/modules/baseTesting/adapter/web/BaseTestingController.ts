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
import { CreateBaseTestingsDto } from '../dto/CreateBaseTesting';
import { BaseTestingDomainEntity } from '../../domain/entities/BaseTesting';
import { CustomError } from 'src/common/types/error';
import { ApiTags } from '@nestjs/swagger';
import { IBaseTestingService } from '../../application/ports/in-ports/IBaseTestingService';
@ApiTags('baseTesting')
@Controller('/base-testing')
export class BaseTestingController extends BaseController {
  constructor(
    @Inject('IBaseTestingService')
    private baseTestingService: IBaseTestingService,
    @InjectMapper() private readonly classMapper: Mapper,
  ) {
    super();
  }

  @Get()
  public async getAllDiscrepancyItems(@Query() query) {
    let discrepancyItems = await this.baseTestingService.getAllBaseTesting(query);

    return discrepancyItems;
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
    console.log(discrepancyItem);
    let result = await this.baseTestingService.newBaseTesting(discrepancyItem);

    if (result) {
      return this.success(result, res);
    }
    return this.sendError(new CustomError('ERROR', 5055), res);

  }
}
