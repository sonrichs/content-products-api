import {
  Between,
  FindOperator,
  LessThanOrEqual,
  MoreThanOrEqual,
} from 'typeorm';

/**
 * Function to get a TypeORM FindOperator for a number range.
 * @param min
 * @param max
 * @returns TypeORM FindOperator for the specified range or undefined if no bounds are provided.
 */
export const getNumberRangeFindOperator = (
  min?: number,
  max?: number,
): FindOperator<number> | undefined => {
  if (min !== undefined && max !== undefined) {
    return Between(min, max);
  } else if (min !== undefined) {
    return MoreThanOrEqual(min);
  } else if (max !== undefined) {
    return LessThanOrEqual(max);
  }
  return undefined;
};
