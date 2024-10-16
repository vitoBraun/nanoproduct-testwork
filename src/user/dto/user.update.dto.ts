import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsString,
  IsMongoId,
  IsOptional,
} from 'class-validator';
import { roles } from '../user.schema';
import { IsIn } from 'class-validator';
export class UpdateUserDTO {
  @IsEmail()
  @IsOptional()
  readonly email: string;

  @IsNotEmpty()
  @MinLength(6)
  @IsOptional()
  readonly password: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(roles)
  @IsOptional()
  role: string;

  @IsNotEmpty()
  @IsMongoId()
  @IsOptional()
  group: string;
}
