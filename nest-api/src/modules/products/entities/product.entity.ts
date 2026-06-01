import {
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';
import { Category } from 'src/modules/categories/entities/category.entity';

@Entity('Products')
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255 })
  name!: string;

  @Column({ length: 255, unique: true })
  slug!: string;

  @Column({ type: 'text', nullable: true })
  shortDescription?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column('decimal', { precision: 10, scale: 2 })
  basePrice!: number;

  @Column({ nullable: true })
  thumbnailUrl?: string;

  @Column()
  hasVariants!: boolean;

  @Column()
  createdAt!: Date;

  @Column()
  updatedAt!: Date;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'categoryId' })
  category!: Category;
}
