import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './entities/task.entity';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
  ) {}

  async create(dto: CreateTaskDto, userId: string): Promise<Task> {
    console.log({ dto, userId });

    const task = this.taskRepo.create({
      ...dto,
      userId,
    });

    return await this.taskRepo.save(task);
  }

  async findAll(userId: string): Promise<Task[]> {
    const tasks = await this.taskRepo.find({
      where: { userId },
    });

    return tasks;
  }

  async findOne(taskId: string, userId: string): Promise<Task> {
    const task = await this.taskRepo.findOne({
      where: { id: taskId, userId },
    });

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
    const task = await this.taskRepo.findOne({
      where: { id: taskId, userId },
    });

    if (!task) throw new NotFoundException('Task not found');

    Object.assign(task, dto);

    return await this.taskRepo.save(task);
  }

  async delete(taskId: string, userId: string): Promise<void> {
    const result = await this.taskRepo.softDelete({
      id: taskId,
      userId,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Task not found');
    }
  }
}
