import { AutoMap } from '@automapper/classes';
import { DomainEntity } from 'src/common/domain/BaseEntity';

export class BaseTestingDomainEntity extends DomainEntity {

  @AutoMap()
  private skuId: number;

  @AutoMap()
  private qty: number;

  @AutoMap()
  protected createdAt: Date;

  constructor(
    skuId: number,
    qty: number,
    id?: number,
  ) {
    super(id);
    this.skuId = skuId;
    this.qty = qty;
  }

}
