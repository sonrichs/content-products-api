import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { unique: true, length: 100 })
  sku: string;

  @Column('varchar', { length: 255 })
  name: string;

  @Column('varchar', { length: 255 })
  brand: string;

  @Column('varchar', { length: 255 })
  model: string;

  @Column('varchar', { length: 255 })
  category: string;

  @Column('varchar', { length: 255 })
  color: string;

  @Column('numeric', { precision: 10, scale: 2 })
  price: number;

  @Column('char', { length: 3 })
  currency: string;

  @Column('integer', { default: 0 })
  stock: number;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
