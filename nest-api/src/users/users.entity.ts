import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: '' })
  phone: string;

  /**
   * Roles: 'Customer' | 'Admin' | 'VIP'
   * Matches the role checks in the React frontend (user.role === "Admin", etc.)
   */
  @Column({ default: 'Customer' })
  role: string;

  @CreateDateColumn()
  createdAt: Date;
}
