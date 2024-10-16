import { IsDate, IsMongoId, IsOptional, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsString()
  description?: string;

  @IsDate()
  dueDate: Date;

  @IsMongoId()
  @IsOptional()
  assignedToUser?: string;

  @IsMongoId()
  @IsOptional()
  assignedToGroup?: string;
}
