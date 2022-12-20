import { TestingModule, Test } from '@nestjs/testing';
import { Result } from 'src/common/types/result';
import { ProductSku } from 'src/modules/inbound/domain/entities/productSku';

import {
  Shipment,
  ShipmentStatus,
} from 'src/modules/inbound/domain/entities/shipment';
import { ShipmentReceivingSku } from 'src/modules/inbound/domain/entities/shipmentReceivedSku';
import { ShipmentReceivingNote } from 'src/modules/inbound/domain/entities/shipmentReceivingNote';
import { ShipmentReturnNote } from 'src/modules/inbound/domain/entities/shipmentReturnNote';
import { ShipmentReturnSku } from 'src/modules/inbound/domain/entities/ShipmentReturnSkus';
import { ShipmentSku } from 'src/modules/inbound/domain/entities/shipmentSkus';
import { InboundTask } from 'src/modules/inbound/domain/entities/tasks/InboundTask';

describe('On Spot Return Shipment', () => {
  let shipment: Shipment;

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

    shipment = new Shipment(
      'S1',
      ShipmentStatus.PARTIALLY_RECEIVED,
      shipmentSkus,
      []
    );

    const returnedSkus: Array<ShipmentReturnSku> = [
      new ShipmentReturnSku(productSku1.Id, productSku1.Mrp, 1),
    ];

    shipment.shipmentReturnNotes.push(
      new ShipmentReturnNote('STN 1', 1, returnedSkus)
    );
  });

  it('should return shipment on the spot if return quantity is not greater than the non-returned rejected quantity (1/2).', () => {
    const returnedSkus: Array<ShipmentReturnSku> = [
      new ShipmentReturnSku(productSku1.Id, productSku1.Mrp, 1),
    ];

    let receivedCount = new Map<string, any>();
    receivedCount.set(`${productSku1.Id}-${productSku1.Mrp}`, {
      rejectedQuantity: 3,
    });

    const result = shipment.return(returnedSkus, receivedCount);

    expect(result.isFailure).toBe(false);
  });

  it('should return shipment on the spot if return quantity is not greater than the non-returned rejected quantity (2/2).', () => {
    const returnedSkus2: Array<ShipmentReturnSku> = [
      new ShipmentReturnSku(productSku1.Id, productSku1.Mrp, 2),
    ];

    shipment.shipmentReturnNotes.push(
      new ShipmentReturnNote('STN 2', 1, returnedSkus2)
    );

    const returnedSkus3: Array<ShipmentReturnSku> = [
      new ShipmentReturnSku(productSku1.Id, productSku1.Mrp, 1),
    ];

    let receivedCount = new Map<string, any>();
    receivedCount.set(`${productSku1.Id}-${productSku1.Mrp}`, {
      rejectedQuantity: 5,
    });

    const result = shipment.return(returnedSkus3, receivedCount);

    expect(result.isFailure).toBe(false);
  });

  it('should fsil to return shipment on the spot if return quantity is greater than the returnable quantity.', () => {
    const returnedSkus2: Array<ShipmentReturnSku> = [
      new ShipmentReturnSku(productSku1.Id, productSku1.Mrp, 2),
    ];

    shipment.shipmentReturnNotes.push(
      new ShipmentReturnNote('STN 2', 1, returnedSkus2)
    );

    const returnedSkus3: Array<ShipmentReturnSku> = [
      new ShipmentReturnSku(productSku1.Id, productSku1.Mrp, 1),
    ];

    let receivedCount = new Map<string, any>();
    receivedCount.set(`${productSku1.Id}-${productSku1.Mrp}`, {
      rejectedQuantity: 3,
    });

    const result = shipment.return(returnedSkus3, receivedCount);

    expect(result.isFailure).toBe(true);
  });
});
