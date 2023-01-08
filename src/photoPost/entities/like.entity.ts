import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { User } from '../../auth/entities/user.entity';
import { PhotoPost } from './photo-post.entity';

@Entity()
export class Like extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => PhotoPost, (photoPost) => photoPost.comments)
  photoPost: PhotoPost;

  @Column()
  photoPostId: number;

  @OneToMany(() => User, (user) => user.id)
  user: User;

  @Column()
  userId: number;
}
