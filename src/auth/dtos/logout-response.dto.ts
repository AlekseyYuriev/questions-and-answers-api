import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO for the response of a logout operation, indicating the result.
 */
export class LogoutResponseDto {
  /**
   * The message indicating the result of the logout operation.
   * @example { message: 'Successfully logged out' }
   */
  @ApiProperty({
    type: 'string',
    description: 'Message indicating the result of the logout operation',
    example: { message: 'Successfully logged out' },
  })
  message: string;
}
