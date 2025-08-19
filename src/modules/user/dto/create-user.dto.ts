import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { Role, RolesArray } from '../schemas/user.schema';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  fullName: string;

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

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  companyName?: string;
}
