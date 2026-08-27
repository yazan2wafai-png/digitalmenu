import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateRestaurantPermissionsDto {
  @IsOptional()
  @IsBoolean()
  canViewOrders?: boolean;

  @IsOptional()
  @IsBoolean()
  canTrackTables?: boolean;

  @IsOptional()
  @IsBoolean()
  canManageMenu?: boolean;

  @IsOptional()
  @IsBoolean()
  canManageStaff?: boolean;

  @IsOptional()
  @IsBoolean()
  canViewAnalytics?: boolean;
}
