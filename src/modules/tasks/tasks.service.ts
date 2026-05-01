import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskQueryDto } from './dto/task-query.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { TaskStatus } from './enums/task.enum';
import { TaskRepository } from './repositories/task.repository';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepo: TaskRepository,
  ) {}

  async create(dto: CreateTaskDto, userId: string): Promise<Task> {
    return this.taskRepo.createTask(dto, userId);
  }

  async findAll(userId: string, query: TaskQueryDto) {
    const result = await this.taskRepo.findAllWithQuery(userId, query);

    return {
      ...result,
    };
  }

  async findOne(taskId: string, userId: string): Promise<Task> {
    const task = await this.taskRepo.findOneByIdAndUser(taskId, userId);

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async update(
    taskId: string,
    userId: string,
    dto: UpdateTaskDto,
  ): Promise<Task> {
    const task = await this.taskRepo.findOneByIdAndUser(taskId, userId);

    if (!task) throw new NotFoundException('Task not found');

    Object.assign(task, dto);

    return await this.taskRepo.saveTask(task);
  }

  async updateStatus(taskId: string, userId: string, status: TaskStatus) {
    const result = await this.taskRepo.updateStatus(taskId, userId, status);

    if (result.affected === 0) {
      throw new NotFoundException('Task not found');
    }

    return { status };
  }

  async delete(taskId: string, userId: string): Promise<void> {
    const result = await this.taskRepo.softDelete(taskId, userId);

    if (result.affected === 0) {
      throw new NotFoundException('Task not found');
    }
  }

  async restore(taskId: string, userId: string) {
    const result = await this.taskRepo.restore(taskId, userId);

    if (result.affected === 0) {
      throw new NotFoundException('Task not found ');
    }

    return this.findOne(taskId, userId);
  }

  async bulkComplete(ids: string[], userId: string) {
    if (!ids.length) {
      return { affected: 0 };
    }

    const result = await this.taskRepo.bulkUpdateStatus(
      ids,
      userId,
      TaskStatus.DONE,
    );

    return {
      affected: result.affected ?? 0,
    };
  }
}
