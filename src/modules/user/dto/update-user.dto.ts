// src/modules/user/dto/update-user.dto.ts
import { IsEmail, IsEnum, IsOptional, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { Role, RolesArray } from '../schemas/user.schema';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @MinLength(6)
  password?: string;

  @IsOptional()
  fullName?: string;

  @IsOptional()
  @IsEnum(RolesArray)
  @Transform(({ value }): Role | undefined => {
    if (typeof value === 'string') {
      const capitalized = (value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()) as Role;
      if (RolesArray.includes(capitalized)) {
        return capitalized;
      }
    }
    return value;
  })
  role?: Role;
}
