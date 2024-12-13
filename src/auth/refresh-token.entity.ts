import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from 'src/users/user.entity';

/**
 * Entity representing a refresh token for a user.
 */
@Entity('RefreshToken')
export class RefreshToken {
  /**
   * The unique identifier of the refresh token.
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * The refresh token string.
   */
  @Column({
    type: 'text',
    nullable: false,
  })
  token: string;

  /**
   * The user associated with this refresh token.
   */
  @ManyToOne(() => User, (user) => user.answers)
  user: User;
}
