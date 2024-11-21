import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Question {
  @PrimaryGeneratedColumn()
  id: number

  @Column({
    type: 'int',
    default: 0,
    nullable: false,
  })
  rating: number

  @Column({
    type: 'varchar',
    length: 96,
    nullable: false,
  })
  author: string

  @Column({
    type: 'varchar',
    length: 512,
    nullable: false,
  })
  title: string

  @Column({
    type: 'text',
    nullable: false,
  })
  description: string

  @Column()
  tags?: string[]

  @Column({
    type: 'timestamp',
    nullable: false,
  })
  createdAt: Date

  @Column({
    type: 'timestamp',
    nullable: false,
  })
  updatedAt: Date
}
