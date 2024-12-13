import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({
    type: 'string',
    description: 'Refresh token for obtaining new access tokens',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhOTU4OTk2NS1jOTYyLTRjY2QtYTM2Ny0yMGY1NGRlNGQwMGYiLCJpYXQiOjE3MzQwOTE3NzMsImV4cCI6MTczNDE3ODE3MywiYXVkIjoibG9jYWxob3N0OjMwMDAiLCJpc3MiOiJsb2NhbGhvc3Q6MzAwMCJ9.I0UrPa23-uewL6YS0zOicXZqiYI-0cBpJLaUvoVqNDY',
  })
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}
