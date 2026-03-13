import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

@Entity('ProductOptionValues')  // Table name in the database
export class ProductOptionValue {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  value: string;

  @Column()
  productOptionId: number;
}
