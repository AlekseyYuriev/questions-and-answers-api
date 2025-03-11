import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO for the response containing authentication tokens.
 */
export class AuthTokenResponseDto {
  /**
   * The access token for authentication.
   * @example 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhOTU4OTk2NS1jOTYyLTRjY2QtYTM2Ny0yMGY1NGRlNGQwMGYiLCJlbWFpbCI6ImFuZ2VsaW5hQGpvbGllLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTczNDA5MTc3MywiZXhwIjoxNzM0MDk1MzczLCJhdWQiOiJsb2NhbGhvc3Q6MzAwMCIsImlzcyI6ImxvY2FsaG9zdDozMDAwIn0.-WkBtdcfw4aZ_VrFR6XcSreCGclso4kF_7ApuPhXWuE'
   */
  @ApiProperty({
    type: 'string',
    description: 'Access token for authentication',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhOTU4OTk2NS1jOTYyLTRjY2QtYTM2Ny0yMGY1NGRlNGQwMGYiLCJlbWFpbCI6ImFuZ2VsaW5hQGpvbGllLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTczNDA5MTc3MywiZXhwIjoxNzM0MDk1MzczLCJhdWQiOiJsb2NhbGhvc3Q6MzAwMCIsImlzcyI6ImxvY2FsaG9zdDozMDAwIn0.-WkBtdcfw4aZ_VrFR6XcSreCGclso4kF_7ApuPhXWuE',
  })
  accessToken: string;

  /**
   * The refresh token for obtaining new access tokens.
   * @example 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhOTU4OTk2NS1jOTYyLTRjY2QtYTM2Ny0yMGY1NGRlNGQwMGYiLCJpYXQiOjE3MzQwOTE3NzMsImV4cCI6MTczNDE3ODE3MywiYXVkIjoibG9jYWxob3N0OjMwMDAiLCJpc3MiOiJsb2NhbGhvc3Q6MzAwMCJ9.I0UrPa23-uewL6YS0zOicXZqiYI-0cBpJLaUvoVqNDY'
   */
  @ApiProperty({
    type: 'string',
    description: 'Refresh token for obtaining new access tokens',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhOTU4OTk2NS1jOTYyLTRjY2QtYTM2Ny0yMGY1NGRlNGQwMGYiLCJpYXQiOjE3MzQwOTE3NzMsImV4cCI6MTczNDE3ODE3MywiYXVkIjoibG9jYWxob3N0OjMwMDAiLCJpc3MiOiJsb2NhbGhvc3Q6MzAwMCJ9.I0UrPa23-uewL6YS0zOicXZqiYI-0cBpJLaUvoVqNDY',
  })
  refreshToken: string;
}
