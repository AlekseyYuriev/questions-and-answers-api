import { Answer } from 'src/answers/answer.entity';
import { Tag } from 'src/tags/tag.entity';
import { User } from 'src/users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('Question')
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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

  @ManyToOne(() => User, (user) => user.questions)
  author: User;

  @OneToMany(() => Answer, (answer) => answer.question, {
    cascade: true,
  })
  answers: Answer[];

  @ManyToMany(() => Tag, (tag) => tag.questions)
  @JoinTable()
  tags?: Tag[];
}
