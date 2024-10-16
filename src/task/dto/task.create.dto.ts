import { IsDateString, IsMongoId, IsOptional, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsString()
  description?: string;

  @IsDateString()
  dueDate: string;

  @IsMongoId()
  @IsOptional()
  assignedToUser?: string;

  @IsMongoId()
  @IsOptional()
  assignedToGroup?: string;
}
