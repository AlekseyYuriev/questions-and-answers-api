import { User } from 'src/users/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'int',
    default: 0,
    nullable: false,
  })
  rating: number;

  @Column({
    type: 'varchar',
    length: 512,
    nullable: false,
  })
  title: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  description: string;

  @Column({
    type: 'timestamp',
    nullable: false,
  })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    nullable: false,
  })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.questions, {
    eager: true,
  })
  author: User;

  tags?: string[];
}
