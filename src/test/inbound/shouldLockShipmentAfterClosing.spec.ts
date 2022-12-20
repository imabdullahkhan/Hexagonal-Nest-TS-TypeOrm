import { Test, TestingModule } from '@nestjs/testing';
import {
  Shipment,
  ShipmentStatus,
} from 'src/modules/inbound/domain/entities/shipment';

describe('Lock Shipment After Closing', () => {
  let shipment: Shipment;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({}).compile();

    shipment = new Shipment('S1', ShipmentStatus.PENDING, null, null);

    shipment.startReceiving();
    shipment.complete();
    shipment.close();
  });

  it('should not reopen shipment once closed.', () => {
    shipment.reopen();
    expect(shipment.Status).toBe(ShipmentStatus.CLOSED);
  });

  it('should not complete shipment once closed.', () => {
    shipment.complete();
    expect(shipment.Status).toBe(ShipmentStatus.CLOSED);
  });

  it('should not start receiving shipment once closed.', () => {
    shipment.startReceiving();
    expect(shipment.Status).toBe(ShipmentStatus.CLOSED);
  });
});
