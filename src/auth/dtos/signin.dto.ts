import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

/**
 * DTO for user sign-in, containing email and password.
 */
export class SignInDto {
  /**
   * The email address of the user.
   * @example 'mark@holden.com'
   */
  @ApiProperty({
    type: 'string',
    description: 'This is email of the user',
    example: 'mark@holden.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  /**
   * The password of the user account.
   * Must be at least 8 characters, include one letter, one number, and one special character.
   * @example 'Password789!'
   */
  @ApiProperty({
    type: 'string',
    description: 'This is password of the user account',
    example: 'Password789!',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(96)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
    message:
      'Minimum eight characters, at least one letter, one number and one special character',
  })
  password: string;
}
