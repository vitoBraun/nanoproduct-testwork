import { IsDate, IsIn, IsMongoId, IsOptional, IsString } from 'class-validator';
import { statuses } from '../task.schema';

export class CreateTaskDto {
  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDate()
  @IsOptional()
  dueDate: Date;

  @IsIn(statuses)
  @IsOptional()
  status: string;

  @IsMongoId()
  @IsOptional()
  assignedToUser?: string;

  @IsMongoId()
  @IsOptional()
  ssignedToGroup?: string;
}
