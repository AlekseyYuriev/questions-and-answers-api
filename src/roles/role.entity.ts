import { User } from 'src/users/user.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { roleType } from './enums/roleType';

@Entity('Role')
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: roleType,
    nullable: false,
    unique: true,
    default: roleType.USER,
  })
  role: roleType;

  @OneToMany(() => User, (user) => user.role)
  users: User[];
}
