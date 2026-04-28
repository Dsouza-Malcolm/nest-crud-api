import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAccessGuard } from '../../common/guards/jwt-access.guard';
import { User } from '../users/entities/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskMapper } from './mappers/task.mapper';
import { TasksService } from './tasks.service';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('tasks')
@UseGuards(JwtAccessGuard)
export class TasksController {
  constructor(private taskService: TasksService) {}

  @Post()
  async create(@Body() dto: CreateTaskDto, @CurrentUser() user: User) {
    const task = await this.taskService.create(dto, user.id);

    return {
      message: 'Task created successfully',
      data: {
        task: TaskMapper.toResponse(task),
      },
    };
  }

  @Get()
  async findAll(@CurrentUser() user: User) {
    const tasks = await this.taskService.findAll(user.id);

    return {
      message: 'Task retrieved successfully',
      data: {
        tasks: TaskMapper.toList(tasks),
      },
    };
  }

  @Get(':id')
  async findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
    @CurrentUser() user: User,
  ) {
    const task = await this.taskService.findOne(id, user.id);

    return {
      message: 'Task retrieved successfully',
      data: {
        task: TaskMapper.toResponse(task),
      },
    };
  }

  @Patch(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateTaskDto,
    @CurrentUser() user: User,
  ) {
    const updatedTask = await this.taskService.update(id, user.id, dto);

    return {
      message: 'Task updated successfully',
      data: {
        task: TaskMapper.toResponse(updatedTask),
      },
    };
  }

  @Delete(':id')
  async delete(
    @Param('id', new ParseUUIDPipe()) id: string,
    @CurrentUser() user: User,
  ) {
    await this.taskService.delete(id, user.id);

    return {
      message: 'Task deleted successfully',
      data: null,
    };
  }
}
