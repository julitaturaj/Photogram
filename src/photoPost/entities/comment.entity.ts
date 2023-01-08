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
export class Comment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @ManyToOne(() => PhotoPost, (photoPost) => photoPost.comments)
  photoPost: PhotoPost;

  @Column()
  photoPostId: number;

  @OneToMany(() => User, (user) => user.id)
  user: User;

  @Column()
  userId: number;
}
