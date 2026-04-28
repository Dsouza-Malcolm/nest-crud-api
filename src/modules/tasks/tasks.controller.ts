import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { JwtAccessGuard } from '../../common/guards/jwt-access.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { TasksService } from './tasks.service';
import { TaskMapper } from './mappers/task.mapper';

@Controller('tasks')
@UseGuards(JwtAccessGuard)
export class TasksController {
  constructor(private taskService: TasksService) {}

  @Post()
  async create(@Body() dto: CreateTaskDto, @CurrentUser() user: User) {
    const task = await this.taskService.create(dto, user.id);

    return {
      task: TaskMapper.toResponse(task),
    };
  }
}
