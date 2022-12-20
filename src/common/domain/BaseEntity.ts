import { AutoMap } from '@automapper/classes';

export abstract class DomainEntity {
  @AutoMap()
  protected id: number;

  public get Id(): number {
    return this.id;
  }

  constructor(id) {
    this.id = id;
  }

  static isEntity(entity: unknown): entity is DomainEntity {
    return entity instanceof DomainEntity;
  }

  /**
   *  Check if two entities are the same Entity. Checks using ID field.
   * @param object Entity
   */
  public equals(object?: DomainEntity): boolean {
    if (object === null || object === undefined) {
      return false;
    }

    if (this === object) {
      return true;
    }

    if (!DomainEntity.isEntity(object)) {
      return false;
    }

    return this.id ? this.id === object.id : false;
  }
}
