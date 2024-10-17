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
export class CreateUserDTO {
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @MinLength(6)
  readonly password: string;

  @IsOptional()
  @IsString()
  @IsIn(roles)
  role: string;

  @IsOptional()
  @IsMongoId()
  group: string;
}
