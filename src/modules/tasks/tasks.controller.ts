import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAccessGuard } from '../../common/guards/jwt-access.guard';
import { User } from '../users/entities/user.entity';
import { BulkCompleteDto } from './dto/bulk-complete.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskQueryDto } from './dto/task-query.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskStatus } from './enums/task.enum';
import { TaskMapper } from './mappers/task.mapper';
import { ParseTaskStatusPipe } from './pipes/parse-task-status.pipe';
import { TasksService } from './tasks.service';

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
  async findAll(@CurrentUser() user: User, @Query() query: TaskQueryDto) {
    const { tasks, ...result } = await this.taskService.findAll(user.id, query);

    return {
      message: 'Task retrieved successfully',
      data: {
        tasks: TaskMapper.toList(tasks),
        ...result,
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

  @Patch(':id/status')
  async updateStatus(
    @Param('id', new ParseUUIDPipe()) id: string,
    @CurrentUser() user: User,
    @Body('status', ParseTaskStatusPipe) status: TaskStatus,
  ) {
    await this.taskService.updateStatus(id, user.id, status);

    return {
      message: 'Task status updated successfully',
      data: {
        id,
        status,
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

  @Post(':id/restore')
  async restore(
    @Param('id', new ParseUUIDPipe()) id: string,
    @CurrentUser() user: User,
  ) {
    const task = await this.taskService.restore(id, user.id);

    return {
      message: 'Task restored successfully',
      data: {
        task: TaskMapper.toResponse(task),
      },
    };
  }

  @Patch('bulk-complete')
  async bulkComplete(@Body() dto: BulkCompleteDto, @CurrentUser() user: User) {
    const result = await this.taskService.bulkComplete(dto.ids, user.id);

    return {
      message: 'Tasks marked as completed',
      data: result,
    };
  }
}
