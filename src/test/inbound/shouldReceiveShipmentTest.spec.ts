import { TestingModule, Test } from '@nestjs/testing';
import { TASK_STATUS } from 'src/common/constants';
import { Result } from 'src/common/types/result';
import { ProductSku } from 'src/modules/inbound/domain/entities/productSku';

import {
  Shipment,
  ShipmentStatus,
} from 'src/modules/inbound/domain/entities/shipment';
import { ShipmentReceivingSku } from 'src/modules/inbound/domain/entities/shipmentReceivedSku';
import { ShipmentReceivingNote } from 'src/modules/inbound/domain/entities/shipmentReceivingNote';
import { ShipmentSku } from 'src/modules/inbound/domain/entities/shipmentSkus';
import { InboundTask } from 'src/modules/inbound/domain/entities/tasks/InboundTask';
import { ReceivingTask } from 'src/modules/inbound/domain/entities/tasks/ReceivingTask';
import { TaskStatus } from 'src/modules/inbound/domain/entities/tasks/Task';
import { Task } from 'src/modules/inventory/domain/entities/Task';

describe('Receiving Shipment', () => {
  let shipment: Shipment;
  let task: InboundTask;

  const productSku1 = new ProductSku('Milk pack 1/12', 1, 100, 1);
  const productSku2 = new ProductSku('Eggs 1/12', 1, 100, 2);
  const productSku1WithDiffMrp = new ProductSku('Milk pack 1/12', 1, 110, 1);

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({}).compile();

    const shipmentSkus = [
      new ShipmentSku(productSku1.Id, productSku1.Mrp, 1, 10, 10, 10, 1),
      new ShipmentSku(
        productSku1.Id,
        productSku1WithDiffMrp.Mrp,
        2,
        8,
        8,
        8,
        2
      ),
      new ShipmentSku(productSku2.Id, productSku2.Mrp, 2, 8, 8, 8, 2),
    ];

    const receivedSkusForSRN1: Array<ShipmentReceivingSku> = [
      new ShipmentReceivingSku(productSku1.Id, productSku1.Mrp, 3, 3, 0),
      new ShipmentReceivingSku(productSku2.Id, productSku2.Mrp, 3, 3, 0),
      new ShipmentReceivingSku(
        productSku1WithDiffMrp.Id,
        productSku1WithDiffMrp.Mrp,
        3,
        3,
        0
      ),
    ];

    const receivedSkusForSRN2: Array<ShipmentReceivingSku> = [
      new ShipmentReceivingSku(productSku1.Id, productSku1.Mrp, 2, 2, 0),
      new ShipmentReceivingSku(productSku2.Id, productSku2.Mrp, 1, 1, 0),
      new ShipmentReceivingSku(
        productSku1WithDiffMrp.Id,
        productSku1WithDiffMrp.Mrp,
        3,
        3,
        0
      ),
    ];

    const shipmentReceivingNotes: Array<ShipmentReceivingNote> = [
      new ShipmentReceivingNote('url 1', 'Srn 1', receivedSkusForSRN1),
      new ShipmentReceivingNote('url 2', 'srn 2', receivedSkusForSRN2),
    ];

    shipment = new Shipment(
      'S1',
      ShipmentStatus.PENDING,
      shipmentSkus,
      shipmentReceivingNotes,
      { id: 1 }
    );

    task = new ReceivingTask(
      1,
      1,
      shipment.Id,
      'VEH-241',
      1,
      TaskStatus.IN_PROGRESS,
      new Date(),
      1
    );
  });

  it('should fail if any skus are received before receiving process has started.', () => {
    const receivedSkus: Array<ShipmentReceivingSku> = [
      new ShipmentReceivingSku(productSku1.Id, productSku1.Mrp, 3, 3, 0),
      new ShipmentReceivingSku(productSku2.Id, productSku2.Mrp, 3, 3, 0),
      new ShipmentReceivingSku(
        productSku1WithDiffMrp.Id,
        productSku1WithDiffMrp.Mrp,
        3,
        3,
        0
      ),
    ];

    const result: Result<InboundTask> = shipment.receive(receivedSkus, null);

    expect(result.isFailure).toBe(true);
  });

  it('should receive if total accepted quantity does not exceed shipment quantity.', () => {
    shipment.startReceiving();

    const receivedSkus: Array<ShipmentReceivingSku> = [
      new ShipmentReceivingSku(productSku1.Id, productSku1.Mrp, 5, 5, 0),
      new ShipmentReceivingSku(productSku2.Id, productSku2.Mrp, 4, 4, 0),
      new ShipmentReceivingSku(
        productSku1WithDiffMrp.Id,
        productSku1WithDiffMrp.Mrp,
        2,
        2,
        0
      ),
    ];

    const result: Result<InboundTask> = shipment.receive(receivedSkus, task);

    expect(result.isFailure).toBe(false);
  });

  it('should fail receiving if total accepted quantity exceed shipment quantity.', () => {
    shipment.startReceiving();

    const receivedSkus: Array<ShipmentReceivingSku> = [
      new ShipmentReceivingSku(productSku1.Id, productSku1.Mrp, 5, 5, 0),
      new ShipmentReceivingSku(productSku2.Id, productSku2.Mrp, 4, 4, 0),
      new ShipmentReceivingSku(
        productSku1WithDiffMrp.Id,
        productSku1WithDiffMrp.Mrp,
        3,
        3,
        0
      ),
    ];

    const result: Result<InboundTask> = shipment.receive(receivedSkus, null);

    expect(result.isFailure).toBe(true);
  });
});
