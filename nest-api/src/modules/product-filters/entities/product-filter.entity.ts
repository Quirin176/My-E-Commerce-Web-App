import {
  Entity,
  JoinColumn,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

import { Product } from '../../products/entities/product.entity';
import { ProductOptionValue } from '../../product-option-values/entities/option-value.entity';

@Entity('ProductFilters')  // Table name in the database
export class ProductFilter {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  productId!: number;

  @Column()
  optionValueId!: number;

  @JoinColumn({ name: 'productId' })
  product!: Product;

  @JoinColumn({ name: 'optionValueId' })
  optionValue!: ProductOptionValue;
}