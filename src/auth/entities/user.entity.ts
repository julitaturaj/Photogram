import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
  BaseEntity,
} from 'typeorm';

@Entity()
@Unique(['email'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  isActive: boolean;

  @Column()
  verificationToken: string;
}
