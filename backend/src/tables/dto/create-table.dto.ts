import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class CreateTableDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  qrIdentifier?: string;

  @IsString()
  @IsOptional()
  nfcIdentifier?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
