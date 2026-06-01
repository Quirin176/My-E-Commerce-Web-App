import {
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';
import { Category } from '../../categories/entities/category.entity';

@Entity('Products')
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 300 })
  name!: string;

  @Column({ length: 300, unique: true })
  slug!: string;

  @Column({ type: 'nvarchar', length: 1000, nullable: true })
  shortDescription?: string;

  @Column({ type: 'nvarchar', length: 'max' as any, nullable: true })
  description?: string;

  @Column('decimal', { precision: 18, scale: 2 })
  basePrice!: number;

  @Column({ length: 1000, nullable: true })
  thumbnailUrl?: string;

  @Column()
  categoryId!: number;

  @Column({ default: false })
  hasVariants!: boolean;

  @Column()
  createdAt!: Date;

  @Column()
  updatedAt!: Date;

  // Eager-load category so every query includes it automatically
  @ManyToOne(() => Category, { eager: true })
  @JoinColumn({ name: 'categoryId' })
  category!: Category;
}