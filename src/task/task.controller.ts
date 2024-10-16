import { TaskService } from './task.service';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/task.create.dto';
import { User } from 'src/common/user.decorator';
import { IdDTO } from 'src/common/dto/id.dto';
import { UpdateTaskDto } from './dto/task.update.dto';
import { RoleGuard } from 'src/auth/roles.guard';
import { TaskListQueryDTO } from './dto/task.list-query.dto';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  addTask(@Body() task: CreateTaskDto, @User() user) {
    return this.taskService.addTask({ ...task, assignedToUser: user.id });
  }

  @Get('list')
  getTasks(@User() user, @Query() query: TaskListQueryDTO) {
    return this.taskService.getTasksByUserId({
      assignedToUserId: user.id,
      query,
    });
  }

  @Patch('/:id')
  updateTask(
    @Param() { id }: IdDTO,
    @Body() task: UpdateTaskDto,
    @User() user,
  ) {
    return this.taskService.updateTaskById({
      id,
      task,
      assignedToUser: user.id,
    });
  }

  // ADMIN ENDPOINTS
  @Get('/list/user/:id')
  @RoleGuard('admin')
  getTasksOfUser(@Param() { id }: IdDTO, @Query() query: TaskListQueryDTO) {
    return this.taskService.getTasksByUserId({
      assignedToUserId: id,
      query,
    });
  }

  @Get('/list/group/:id')
  @RoleGuard('admin')
  getTasksOfGroup(@Param() { id }: IdDTO, @Query() query: TaskListQueryDTO) {
    return this.taskService.getTasksByGroupId({
      assignedToGroupId: id,
      query,
    });
  }
}
