import { TestingModule, Test } from '@nestjs/testing';
import { Result } from 'src/common/types/result';
import { ProductSku } from 'src/modules/inbound/domain/entities/productSku';
import {
  Shipment,
  ShipmentStatus,
} from 'src/modules/inbound/domain/entities/shipment';
import { ShipmentReceivingSku } from 'src/modules/inbound/domain/entities/shipmentReceivedSku';
import { ShipmentReceivingNote } from 'src/modules/inbound/domain/entities/shipmentReceivingNote';
import { ShipmentSku } from 'src/modules/inbound/domain/entities/shipmentSkus';
import { TaskStatus } from 'src/modules/inbound/domain/entities/tasks/Task';
import { InboundTask } from 'src/modules/inbound/domain/entities/tasks/InboundTask';
import { ReceivingTask } from 'src/modules/inbound/domain/entities/tasks/ReceivingTask';
import { DomainErrors } from 'src/modules/inbound/domain/errors/inboundShipmentErrors';

describe('Should Complete Shipment When', () => {
  let shipment: Shipment;

  const productSku1 = new ProductSku('Milk pack 1/12', 1, 100, 1);
  const productSku2 = new ProductSku('Eggs 1/12', 1, 100, 2);

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({}).compile();

    const shipmentSkus = [
      new ShipmentSku(productSku1.Id, 1, 10, 10, 10, 1),
      new ShipmentSku(productSku2.Id, 2, 8, 8, 8, 2),
    ];

    const receivedSkusForSRN1: Array<ShipmentReceivingSku> = [
      new ShipmentReceivingSku(productSku1.Id, 3, 3, 0, 1),
      new ShipmentReceivingSku(productSku2.Id, 3, 3, 0, 1),
    ];

    const receivedSkusForSRN2: Array<ShipmentReceivingSku> = [
      new ShipmentReceivingSku(productSku1.Id, 2, 2, 0, 3),
      new ShipmentReceivingSku(productSku2.Id, 1, 1, 0, 4),
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
  });

  it('should complete shipment if all of its tasks are completed.', () => {
    shipment.startReceiving();

    const tasks: ReceivingTask[] = [
      new ReceivingTask(1, 1, shipment.Id, 'Vehicle-1', 1, TaskStatus.CLOSED),
      new ReceivingTask(1, 1, shipment.Id, 'Vehicle-2', 1, TaskStatus.CLOSED),
      new ReceivingTask(1, 1, shipment.Id, 'Vehicle-3', 1, TaskStatus.CLOSED),
    ];

    const result = shipment.complete(tasks);
    expect(shipment.Status).toBe(ShipmentStatus.COMPLETED);
  });

  it('should not complete shipment if any of its task is not completed.', () => {
    shipment.startReceiving();

    const tasks: ReceivingTask[] = [
      new ReceivingTask(1, 1, shipment.Id, 'Vehicle-1', 1, TaskStatus.CLOSED),
      new ReceivingTask(1, 1, shipment.Id, 'Vehicle-2', 1, TaskStatus.CLOSED),
      new ReceivingTask(
        1,
        1,
        shipment.Id,
        'Vehicle-3',
        1,
        TaskStatus.IN_PROGRESS
      ),
    ];

    const result = shipment.complete(tasks);
    expect(shipment.Status).toBe(ShipmentStatus.IN_PROGRESS);
    expect(result.error).toBe(DomainErrors.ShipmentTasksNotCompleted);
  });
});
