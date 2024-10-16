import { TaskService } from './task.service';
import { Body, Controller } from '@nestjs/common';
import { CreateTaskDto } from './dto/task.create.dto';
import { User } from 'src/common/user.decorator';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  addTask(@Body() task: CreateTaskDto, @User() user) {
    return this.taskService.addTask({ ...task, assignedToUser: user.id });
  }
}
