import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterUserDTO {
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @MinLength(5)
  readonly password: string;
}
