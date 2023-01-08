import { User } from '../../auth/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Comment } from './comment.entity';
import { Like } from './like.entity';

@Entity()
export class PhotoPost extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  photoPath: string;

  @ManyToOne(() => User, (user) => user.photoPosts)
  user: User;

  @Column()
  userId: number;

  @OneToMany(() => Comment, (comment) => comment.photoPost)
  comments: Comment[];

  @OneToMany(() => Like, (like) => like.photoPost)
  likes: Like[];
}
