import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './entities/task.entity';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskQueryDto } from './dto/task-query.dto';
import {
  SortOrder,
  SortQuery,
  TASK_SORT_FIELDS,
} from './enums/task-query.enum';
import { TaskStatus } from './enums/task.enum';

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

  async findAll(userId: string, query: TaskQueryDto) {
    const {
      limit = 10,
      order = SortOrder.DESC,
      page = 1,
      priority,
      search,
      sort = SortQuery.CREATED_AT,
      status,
    } = query;

    const queryBuilder = this.taskRepo.createQueryBuilder('task');

    queryBuilder
      .where('task.userId = :userId', { userId })
      .andWhere('task.deletedAt IS NULL');

    if (status) {
      queryBuilder.andWhere('task.status = :status', { status });
    }

    if (priority) {
      queryBuilder.andWhere('task.priority = :priority', { priority });
    }

    if (search) {
      queryBuilder.andWhere(
        `
        (
          task.title ILIKE :search
          OR
          task.description ILIKE :search
        )
        `,
        {
          search: `%${search}%`,
        },
      );
    }

    queryBuilder.orderBy(
      TASK_SORT_FIELDS[sort],
      order?.toUpperCase() as 'ASC' | 'DESC',
    );

    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [tasks, total] = await queryBuilder.getManyAndCount();

    return {
      tasks,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
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

  async restore(taskId: string, userId: string) {
    const result = await this.taskRepo.restore({
      id: taskId,
      userId,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Task not found ');
    }

    return this.findOne(taskId, userId);
  }

  async bulkComplete(ids: string[], userId: string) {
    if (!ids.length) {
      return { affected: 0 };
    }

    const result = await this.taskRepo.update(
      {
        id: In(ids),
        userId,
      },
      { status: TaskStatus.DONE },
    );

    return {
      affected: result.affected ?? 0,
    };
  }
}
