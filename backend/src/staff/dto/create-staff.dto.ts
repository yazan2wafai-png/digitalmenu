import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { StaffRole } from '../../common/staff-role.enum';

export class CreateStaffDto {
  @IsEmail({}, { message: 'A valid email is required' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(StaffRole, { message: 'staffRole must be one of OWNER, EDITOR, VIEWER' })
  staffRole?: StaffRole;
}
