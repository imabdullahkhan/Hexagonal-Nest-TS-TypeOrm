import { classToPlain } from 'class-transformer';
import { BaseEntity } from 'typeorm';

export abstract class BaseModel extends BaseEntity {
  createdAt;

  updatedAt;

  deletedAt;

  // @AfterLoad()
  // convertDates() {
  //     this.UpdatedAt = new Date(this.UpdatedAt);
  //     this.CreatedAt = new Date(this.CreatedAt);
  // }

  public Fill(obj: any): any {
    const restrictedFields = this._GetRestrictedFields();
    //Todo:it will be discussed
    let keys: string[] = Object.keys(obj);
    for (let i = 0; i < restrictedFields.length; i++) {
      if (keys.includes(restrictedFields[i])) {
        delete obj[restrictedFields[i]];
      }
    }
    keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
      if (keys[i] in this && (obj[keys[i]] || obj[keys[i]] === 0)) {
        this[keys[i]] = obj[keys[i]];
      }
    }
    return this;
  }

  protected _GetRestrictedFields(): string[] {
    return ['id'];
  }

  toJSON() {
    return classToPlain(this);
  }
}

export enum BaseModelEntityType {
  User = 1,
  Vendor = 2,
  Order = 3,
  Product = 4,
  Chat = 5,
  Queue = 6,
  Promotion = 7,
}
