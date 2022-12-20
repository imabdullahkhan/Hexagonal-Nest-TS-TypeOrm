import { Test, TestingModule } from '@nestjs/testing';
import { Result } from 'src/common/types/result';
import { ProductSku } from 'src/modules/inbound/domain/entities/productSku';
import {
  Shipment,
  ShipmentStatus,
} from 'src/modules/inbound/domain/entities/shipment';
import { ShipmentSku } from 'src/modules/inbound/domain/entities/shipmentSkus';

describe('Change Shipment Status', () => {
  let shipment: Shipment;

  const productSku1 = new ProductSku('Milk pack 1/12', 1, 100, 1);
  const productSku2 = new ProductSku('Eggs 1/12', 1, 100, 2);

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({}).compile();

    const shipmentSkus = [
      new ShipmentSku(productSku1.Id, 1, 10, 10, 10, 1),
      new ShipmentSku(productSku2.Id, 2, 8, 8, 8, 2),
    ];

    shipment = new Shipment('S1', ShipmentStatus.PENDING, shipmentSkus, []);
  });

  it('should create shipment in pending state initially.', () => {
    expect(shipment.Status).toBe(ShipmentStatus.PENDING);
  });

  it('should change status to in progress when start receiving.', () => {
    shipment.startReceiving();
    expect(shipment.Status).toBe(ShipmentStatus.IN_PROGRESS);
  });

  it('should not change shipment status from Pending -> Closed.', () => {
    shipment.close();

    expect(shipment.Status).toBe(ShipmentStatus.PENDING);
  });

  it('should not change shipment status from IN-PROGRESS -> Closed.', () => {
    shipment.startReceiving();
    shipment.close();
    expect(shipment.Status).toBe(ShipmentStatus.IN_PROGRESS);
  });
});
