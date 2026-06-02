import {
  Entity,
  JoinColumn,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

import { ProductOption } from '../../product-options/entities/option.entity';

@Entity('ProductOptionValues')  // Table name in the database
export class ProductOptionValue {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255 })
  value!: string;

  @Column()
  productOptionId!: number;

  @JoinColumn({ name: 'productOptionId' })
  productOption!: ProductOption;
}