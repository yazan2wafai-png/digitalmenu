import {
  IsObject, IsOptional, IsString,
  IsInt, Min, IsNumberString,
} from 'class-validator';

export class CreateProductDto {
  @IsObject()
  name: Record<string, string>;

  @IsOptional()
  @IsObject()
  description?: Record<string, string>;

  /**
   * Price as a string to avoid floating-point issues, e.g. "220.00"
   */
  @IsNumberString()
  price: string;

  @IsOptional()
  @IsString()
  photoUrl?: string | null;

  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}
