import { TestingModule, Test } from '@nestjs/testing';
import {
  Shipment,
  ShipmentStatus,
} from 'src/modules/inbound/domain/entities/shipment';

describe('After Shipment Completion', () => {
  let shipment: Shipment;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({}).compile();

    shipment = new Shipment('S1', ShipmentStatus.PENDING, null, null);

    shipment.startReceiving();
    shipment.complete([]);
  });

  it('should reopen shipment after it is completed.', () => {
    shipment.reopen();
    expect(shipment.Status).toBe(ShipmentStatus.REOPENED);
  });

  it('should close shipment after it is completed.', () => {
    shipment.close();
    expect(shipment.Status).toBe(ShipmentStatus.CLOSED);
  });

  it('should not start receiving after it is completed.', () => {
    shipment.startReceiving();
    expect(shipment.Status).toBe(ShipmentStatus.COMPLETED);
  });
});
