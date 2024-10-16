import { TaskService } from './task.service';
import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateTaskDto } from './dto/task.create.dto';
import { User } from 'src/common/user.decorator';
import { IdDTO } from 'src/common/dto/id.dto';
import { UpdateTaskDto } from './dto/task.update.dto';

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

  @Patch('/:id')
  updateTask(
    @Param() { id }: IdDTO,
    @Body() task: UpdateTaskDto,
    @User() user,
  ) {
    return this.taskService.updateTaskById({ id, task, userId: user.id });
  }
}
