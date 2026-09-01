import { IsObject, IsInt, IsOptional, Min, IsString } from 'class-validator';

export class LocalizedStringDto {
  [locale: string]: string;
}

export class CreateCategoryDto {
  /**
   * Localized name object, e.g. { "tr": "Burgerler", "en": "Burgers", "ar": "برغر" }
   */
  @IsObject()
  name: Record<string, string>;

  @IsOptional()
  @IsString()
  photoUrl?: string | null;

  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}
