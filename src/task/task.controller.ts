import { TaskService } from './task.service';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateTaskDto } from './dto/task.create.dto';
import { User } from 'src/common/user.decorator';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  addTask(@Body() task: CreateTaskDto, @User() user) {
    return this.taskService.addTask({ ...task, assignedToUser: user.id });
  }

  @Get('list')
  getTasks(@User() user) {
    return this.taskService.getTasksByUserId(user.id);
  }
}
