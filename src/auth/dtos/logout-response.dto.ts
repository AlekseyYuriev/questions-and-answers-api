import { ApiProperty } from '@nestjs/swagger';

export class LogoutResponseDto {
  @ApiProperty({
    type: 'string',
    description: 'Message indicating the result of the logout operation',
    example: { message: 'Successfully logged out' },
  })
  message: string;
}
