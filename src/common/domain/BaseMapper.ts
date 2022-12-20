export interface BaseMapper<DomainEntity, DbRecord> {
  toPersistence(entity: DomainEntity): DbRecord;
  toDomain(record: any, ...rest): DomainEntity;
  toDomainList(record: any[]): DomainEntity[];
}
