import { IsObject, IsOptional, IsString, Matches } from 'class-validator';

export class UpdateRestaurantProfileDto {
  /**
   * Localized name object, e.g. { "tr": "Act Noir", "en": "Act Noir" }
   */
  @IsOptional()
  @IsObject()
  name?: Record<string, string>;

  @IsOptional()
  @IsString()
  logoUrl?: string;

  @IsOptional()
  @IsString()
  @Matches(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, {
    message: 'themeColor must be a valid hex color, e.g. #D6608E',
  })
  themeColor?: string;
}
