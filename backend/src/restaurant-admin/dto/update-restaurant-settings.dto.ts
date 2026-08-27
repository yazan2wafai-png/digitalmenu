import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateRestaurantSettingsDto {
  @IsOptional()
  @IsBoolean()
  orderingEnabled?: boolean;

  @IsOptional()
  @IsBoolean()
  dineInEnabled?: boolean;

  @IsOptional()
  @IsBoolean()
  takeawayEnabled?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  estimatedPrepMinutes?: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsString()
  timezone?: string;

  @IsOptional()
  @IsBoolean()
  enableOrdering?: boolean;

  @IsOptional()
  @IsBoolean()
  enableTables?: boolean;

  @IsOptional()
  @IsBoolean()
  enableAnalytics?: boolean;

  @IsOptional()
  @IsBoolean()
  enableMultiLanguage?: boolean;

  @IsOptional()
  @IsBoolean()
  enableReviews?: boolean;

  @IsOptional()
  @IsBoolean()
  enableServiceCall?: boolean;
}
