import {
  IsDateString,
  IsIn,
  IsMongoId,
  IsOptional,
  IsString,
} from 'class-validator';
import { statuses } from '../task.schema';

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  dueDate?: Date;

  @IsIn(statuses)
  @IsOptional()
  status?: string;

  @IsMongoId()
  @IsOptional()
  assignedToUser?: string;

  @IsMongoId()
  @IsOptional()
  assignedToGroup?: string;
}
