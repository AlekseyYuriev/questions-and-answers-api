import {
  IsInt,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator'

export class CreateAnswerDto {
  @IsString()
  @MinLength(4)
  @IsNotEmpty()
  text: string

  @IsString()
  @IsNotEmpty()
  author: string

  @IsInt()
  @Min(0)
  rating: number

  @IsISO8601()
  createdAt: Date

  @IsISO8601()
  updatedAt: Date
}
