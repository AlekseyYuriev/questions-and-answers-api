import {
  IsArray,
  IsInt,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator'

export class CreateQuestionDto {
  @IsInt()
  @IsOptional()
  @Min(1)
  @Max(5)
  rating?: number

  @IsString()
  @IsNotEmpty()
  author: string

  @IsString()
  @MinLength(4)
  @IsNotEmpty()
  title: string

  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  description: string

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MinLength(3, { each: true })
  tags?: string[]

  @IsISO8601()
  createdAt: Date

  @IsISO8601()
  updatedAt: Date
}
