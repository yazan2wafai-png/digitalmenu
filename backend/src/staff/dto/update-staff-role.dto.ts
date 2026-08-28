import { IsEnum } from 'class-validator';
import { StaffRole } from '../../common/staff-role.enum';

export class UpdateStaffRoleDto {
  @IsEnum(StaffRole, { message: 'staffRole must be one of OWNER, EDITOR, VIEWER' })
  staffRole: StaffRole;
}
