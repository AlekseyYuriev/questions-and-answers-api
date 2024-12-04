import { Question } from 'src/questions/question.entity';
import { User } from 'src/users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('Answer')
export class Answer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  text: string;

  @Column({
    type: 'int',
    default: 0,
    nullable: false,
  })
  rating: number;

  @CreateDateColumn({
    type: 'timestamp',
    nullable: false,
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    nullable: false,
  })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.answers)
  author: User;

  @ManyToOne(() => Question, (question) => question.answers)
  question: Question;
}
