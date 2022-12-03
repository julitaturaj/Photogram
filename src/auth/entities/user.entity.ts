import { PhotoPost } from 'src/photoPost/entities/photo-post.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
  BaseEntity,
  OneToMany,
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

  @OneToMany(() => PhotoPost, (photoPost) => photoPost.user)
  photoPosts: PhotoPost[];
}
