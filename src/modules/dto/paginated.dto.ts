import { Expose } from 'class-transformer';

class Meta {
  @Expose()
  total: number;
  @Expose()
  skip: number;
  @Expose()
  limit: number;
}

export class Paginated<T> {
  @Expose()
  meta: Meta;

  @Expose()
  data: T[];
}
