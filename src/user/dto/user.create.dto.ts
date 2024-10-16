import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsString,
  IsMongoId,
} from 'class-validator';
import { roles } from '../user.schema';
import { IsIn } from 'class-validator';
export class CreateUserDTO {
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @MinLength(6)
  readonly password: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(roles)
  role: string;

  @IsNotEmpty()
  @IsMongoId()
  group: string;
}
