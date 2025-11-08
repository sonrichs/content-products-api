import { Expose } from 'class-transformer';

interface Meta {
  total: number;
  skip: number;
  limit: number;
}

export class Paginated<T> {
  @Expose()
  meta: Meta;

  @Expose()
  data: T[];
}
