import { User } from 'src/app/modules/users/user.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RoleType } from 'src/shared/auth/enums/role-type.enum';

@Entity('Role')
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: RoleType,
    nullable: false,
    unique: true,
    default: RoleType.User,
  })
  role: RoleType;

  @OneToMany(() => User, (user) => user.role)
  users: User[];
}
