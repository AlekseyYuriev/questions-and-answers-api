import { Answer } from 'src/answers/answer.entity';
import { Question } from 'src/questions/question.entity';
import { Role } from 'src/roles/role.entity';
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 96,
    nullable: false,
  })
  firstName: string;

  @Column({
    type: 'varchar',
    length: 96,
    nullable: true,
  })
  lastName: string;

  @Column({
    type: 'varchar',
    length: 96,
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 96,
    nullable: false,
  })
  password: string;

  @OneToMany(() => Question, (question) => question.author)
  questions: Question[];

  @OneToMany(() => Answer, (answer) => answer.author)
  answers: Answer[];

  @ManyToMany(() => Role, (role) => role.users, {
    onDelete: 'CASCADE',
  })
  roles: Role[];
}
