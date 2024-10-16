import { IsDateString, IsIn, IsOptional } from 'class-validator';
import { statuses } from '../task.schema';

export class TaskListQueryDTO {
  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @IsOptional()
  @IsIn(statuses)
  status?: string;
}
