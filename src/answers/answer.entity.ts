import { User } from 'src/users/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Answer {
  @PrimaryGeneratedColumn()
  id: number;

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

  @ManyToOne(() => User, (user) => user.answers, {
    eager: true,
  })
  author: User;
}
