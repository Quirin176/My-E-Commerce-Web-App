import {
  Entity,
  JoinColumn,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

import { Category } from '../../categories/entities/category.entity';

@Entity('ProductOptions') // Table name in the database
export class ProductOption {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255 })
  name!: string;

  @Column()
  categoryId!: number;

  @JoinColumn({ name: 'categoryId' })
  category!: Category;
}