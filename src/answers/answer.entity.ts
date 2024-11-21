import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
    type: 'varchar',
    length: 256,
    nullable: false,
  })
  author: string;

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
}
