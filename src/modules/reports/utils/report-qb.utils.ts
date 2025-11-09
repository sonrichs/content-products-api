import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';

export function applyDateRangeFilter<T extends ObjectLiteral>(
  qb: SelectQueryBuilder<T>,
  column: string,
  min?: Date,
  max?: Date,
): SelectQueryBuilder<T> {
  const alias = qb.alias;
  if (min) qb.andWhere(`${alias}.${column} >= :min`, { min });
  if (max) qb.andWhere(`${alias}.${column} <= :max`, { max });
  return qb;
}

export function applyBooleanToNumericFilter<T extends ObjectLiteral>(
  qb: SelectQueryBuilder<T>,
  column: string,
  value: boolean,
): SelectQueryBuilder<T> {
  const alias = qb.alias;
  if (value) qb.andWhere(`${alias}.${column} > 0`);
  else qb.andWhere(`(${alias}.${column} <= 0 OR ${alias}.${column} IS NULL)`);
  return qb;
}
