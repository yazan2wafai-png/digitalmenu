import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class CreateRestaurantDto {
  @IsObject({ message: 'Name must be a multilingual JSON object (e.g. { "tr": "...", "en": "..." })' })
  @IsNotEmpty({ message: 'Name is required' })
  name: Record<string, string>;

  @IsString()
  @IsNotEmpty({ message: 'Slug is required' })
  @Matches(/^[a-z0-9-]+$/, {
    message: 'Slug must contain only lowercase alphanumeric characters and hyphens',
  })
  slug: string;

  @IsOptional()
  @IsString()
  themeColor?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  supportedLocales?: string[];

  @IsOptional()
  @IsString()
  defaultLocale?: string;

  @IsEmail({}, { message: 'A valid admin email is required' })
  adminEmail: string;

  @IsString()
  @MinLength(6, { message: 'Admin password must be at least 6 characters long' })
  adminPassword: string;
}
