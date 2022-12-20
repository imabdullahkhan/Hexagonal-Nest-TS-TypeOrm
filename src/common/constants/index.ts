export const NODE_ENV = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
};

export const CREATE = '%d Created';
export const FIND_ALL = '%d Listed';
export const UPDATED = '%d Updated';
export const REMOVED = '%d Removed';
export const FIND_ONE = '%d Extracted';
export const DOES_NOT_EXIST = '%d does not exist!';
export const ALREADY_EXIST = '%d already exist!';
export const TASK_CLOSED = '%d task closed.';

export const ORDER_FILTERING = [
  'id',
  'status',
  'orderNumber',
  'userId',
  'masterOrderId',
];

export const RESPONSE_STATUS = {
  SUCCESS: true,
  FAIL: false,
};

export const RESPONSE_STATUS_CODE = {
  SUCCESS: 200,
  UNAUTHORIZED: 401,
  BADREQUEST: 400,
};

export enum InventoryFlags {
  INFLOW = 1,
  OUTFLOW = 2,
  RETURN = 3,
  WASTAGE = 4,
  ONHOLD = 6,
  REJECTED = 7,
}

export const INVENTORY_FLAG = {
  PUT_AWAY: 'Put Away',
};

export enum LOCATION_TYPE {
  BULK_LOCATION = 'Bulk location',
  PICKING_LOCATION = 'Picking location',
  INBOUND_DOCK = 'Inbound dock',
  PRODUCTION_INPUT_LOCATION = 'Production input location',
  INSPECTION_LOCATION = 'Inspection location',
  KANBAN_SUPERMARKET = 'kanban supermarket',
  OUTBOUND_DOCK = 'Outbound dock',
}

export enum LOCATION_TYPE_DISPLAY_NAME {
  INBOUND_AREA = 'Inbound Area',
  INVENTORY_AREA = 'Inventory Area',
  OUTBOUND_AREA = 'Outbound Area',
  DAMAGED_AREA = 'Damaged Area',
  HOLDING_AREA = 'Holding Area',
}

export enum DISCREPANCY_TYPES {
  EXCESS = 'Excess',
  DAMAGED = 'Damaged',
}

export enum PUT_AWAY_TYPE {
  RECEIVING = 'Receiving',
  RETURN = 'Return',
  EXCESS = 'Excess',
  DAMAGED = 'Damaged',
  TRANSFER = 'Transfer',
}

export const USER_ROLE_SLUG = {
  PUTAWAYAGENT: 'PUT_AWAY_AGENT',
  SUPERVISOR: 'SUPERVISOR',
  INBOUNDAGENT: 'INBOUND_AGENT',
  PICKER: 'PICKER',
};

export enum ORDER_BY {
  DESC = 'DESC',
  ASC = 'ASC',
}

export const TASK_STATUS = {
  PENDING: 1,
  ASSIGNED: 2,
  INPROGRESS: 3,
  CLOSED: 4,
  CANCELLED: 5,
};

export const FULFILLMENT_MODE = {
  WAAS: 1,
  CROSS_DOCK: 2,
  DROPSHIPPING: 3,
};

export const TASK_TYPE = {
  RECEIVING: 1,
  RETURN: 2,
  EXCESS: 3,
  DAMAGED: 4,
  TRANSFER: 5,
};

export const DURATION = {
  ONEDAY: 86400000,
};

export const REQUEST_TYPE = {
  EXCLUSIVE: 1,
  PARTIAL: 2,
  INCLUSIVE: 3,
};

export const TASK_STATUS_NAME = {
  PENDING: 'Pending',
};

export const ERROR_MESSAGE = {
  METHOD_NOT_IMPLEMENTED: 'Method not implemented.',
  SHIPMENT: {
    NOT_FOUND: 'Shipment not found.',
    IN_PROGRESS: 'This shipment is already in progress.',
    CLOSED: 'This shipment is already closed.',
    QUANTITY_EXCEEDS:
      'The accepted quantity of the item exceeds shipment quantity.',
    NOT_STARTED: 'Shipment receiving is not started.',
    NOT_CLOSED: 'Pending shipment cant be closed.',
    NOT_SHIPPED: 'This SKU is not shipped.',
    NOT_FOUND_RECEIVING: 'Shipment Receiving not found.',
    NOT_FOUND_RETURN_NOTE: 'Shipment Retrun not found.',
  },
  PUT_AWAY: {
    CANNOT_UPDATE_STATUS: 'This put task status cannot be updated',
    DISCREPANCY_NOT_FOUND: 'There are no items in this bin.',
  },
};

export const SHIPMENT_STATUS = {
  READY_FOR_PUT_AWAY: 'Ready For PutAway',
};

export const CLIENT_KAFKA = 'CLIENT_KAFKA';
export const KAFKA_PRODUCER = 'KAFKA_PRODUCER';
export const CLIENT_KAFKA_ID = 'warehouse-microservices';

export enum KAFKA_TOPICS {
  INVENTORY = 'inventory',
  SITES = 'sites',
  WAREHOUSES = 'warehouses',
}

export const TOPICS_EVENT_TYPE = {
  INVENTORY: {
    UPDATED: {
      NAME: 'InventoryUpdated',
      KEY: 1,
    },
  },
  SITES: {
    CREATED: {
      NAME: 'SiteCreated',
      KEY: 1,
    },
    UPDATED: {
      NAME: 'SiteUpdated',
      KEY: 2,
    },
    DELETED: {
      NAME: 'SiteDeleted',
      KEY: 3,
    },
  },
  WAREHOUSES: {
    CREATED: {
      NAME: 'WarehouseCreated',
      KEY: 1,
    },
    UPDATED: {
      NAME: 'WarehouseUpdated',
      KEY: 2,
    },
    DELETED: {
      NAME: 'WarehouseDeleted',
      KEY: 3,
    },
  },
};

export const PAGE_SIZE = 10;
export const DEFLAUT_PAGE = 1;

export const SHIPMENT_SKU_TYPE_KEY = {
  RETURN: 'shipmentReturnNotes',
  RECEIVING: 'shipmentReceivingNotes',
};

export const SHIPMENT_SKU_QUANTITY_KEY = {
  RETURN: 'returnedQuantity',
  RECEIVING: 'acceptedQuantity',
};

export const MAX_INT_NUMBER = 2147483647;
