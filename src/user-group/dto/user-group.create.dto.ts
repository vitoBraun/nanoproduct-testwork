import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateUserGroupDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description: string;
}
