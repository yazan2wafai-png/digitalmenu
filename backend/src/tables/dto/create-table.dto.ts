import { IsString, IsNotEmpty, IsOptional, IsInt, Min } from 'class-validator';

export class CreateTableDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  identifier?: string;

  @IsInt()
  @Min(1)
  @IsOptional()
  capacity?: number;
}
