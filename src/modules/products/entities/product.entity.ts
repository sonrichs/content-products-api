import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
