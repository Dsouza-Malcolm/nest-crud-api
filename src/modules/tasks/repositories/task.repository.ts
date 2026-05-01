import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, Repository, UpdateResult } from 'typeorm';
import { CreateTaskDto } from '../dto/create-task.dto';
import { TaskQueryDto } from '../dto/task-query.dto';
import { Task } from '../entities/task.entity';
import {
  SortOrder,
  SortQuery,
  TASK_SORT_FIELDS,
} from '../enums/task-query.enum';
import { TaskStatus } from '../enums/task.enum';

@Injectable()
export class TaskRepository {
  constructor(
    @InjectRepository(Task)
    private readonly repo: Repository<Task>,
  ) {}

  async findAllWithQuery(userId: string, query: TaskQueryDto) {
    const {
      status,
      priority,
      search,
      sort = SortQuery.CREATED_AT,
      order = SortOrder.DESC,
      page = 1,
      limit = 10,
    } = query;

    const qb = this.repo.createQueryBuilder('task');

    qb.where('task.userId = :userId', { userId });
    qb.andWhere('task.archivedAt IS NULL');

    if (status) {
      qb.andWhere('task.status = :status', { status });
    }

    if (priority) {
      qb.andWhere('task.priority = :priority', { priority });
    }

    if (search) {
      qb.andWhere(
        `(task.title ILIKE :search OR task.description ILIKE :search)`,
        { search: `%${search}%` },
      );
    }

    qb.orderBy(TASK_SORT_FIELDS[sort], order.toUpperCase() as 'ASC' | 'DESC');

    const skip = (page - 1) * limit;
    qb.skip(skip).take(limit);

    const [tasks, total] = await qb.getManyAndCount();

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

  async findOneByIdAndUser(id: string, userId: string): Promise<Task | null> {
    return this.repo.findOne({ where: { id, userId } });
  }

  async createTask(dto: CreateTaskDto, userId: string): Promise<Task> {
    const task = this.repo.create({ ...dto, userId });
    return this.repo.save(task);
  }

  async updateStatus(
    id: string,
    userId: string,
    status: TaskStatus,
  ): Promise<UpdateResult> {
    return this.repo.update({ id, userId, deletedAt: IsNull() }, { status });
  }

  async saveTask(task: Task): Promise<Task> {
    return this.repo.save(task);
  }

  async softDelete(id: string, userId: string): Promise<UpdateResult> {
    return this.repo.update(
      { id, userId, deletedAt: IsNull() },
      { deletedAt: new Date() },
    );
  }

  async restore(id: string, userId: string): Promise<UpdateResult> {
    return this.repo.update({ id, userId }, { deletedAt: null });
  }

  async findManyByIds(ids: string[], userId: string): Promise<Task[]> {
    return this.repo.find({
      where: {
        id: In(ids),
        userId,
        deletedAt: IsNull(),
      },
    });
  }

  async saveMany(tasks: Task[]): Promise<Task[]> {
    return this.repo.save(tasks);
  }

  async bulkUpdateStatus(
    ids: string[],
    userId: string,
    status: TaskStatus,
  ): Promise<UpdateResult> {
    return this.repo.update(
      {
        id: In(ids),
        userId,
        deletedAt: IsNull(),
      },
      { status },
    );
  }
}
