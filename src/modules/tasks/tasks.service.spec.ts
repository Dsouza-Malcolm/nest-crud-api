import { NotFoundException } from '@nestjs/common';
import { TaskRepository } from './repositories/task.repository';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './enums/task.enum';
import { UpdateTaskDto } from './dto/update-task.dto';

describe('TaskService', () => {
  let service: TasksService;
  let mockRepo: jest.Mocked<TaskRepository>;

  beforeEach(() => {
    mockRepo = {
      createTask: jest.fn(),
      findAllWithQuery: jest.fn(),
      findOneByIdAndUser: jest.fn(),
      saveTask: jest.fn(),
      updateStatus: jest.fn(),
      softDelete: jest.fn(),
      restore: jest.fn(),
      findManyByIds: jest.fn(),
      saveMany: jest.fn(),
      bulkUpdateStatus: jest.fn(),
    } as jest.Mocked<TaskRepository>;

    service = new TasksService(mockRepo);
  });

  it('should return a task when found', async () => {
    const mockTask = {
      id: 'uuid-1',
      title: 'Test task',
      userId: 'user-1',
    } as any;
    mockRepo.findOneByIdAndUser.mockResolvedValue(mockTask);

    const result = await service.findOne('uuid-1', 'user-1');

    expect(result).toEqual(mockTask);
    expect(mockRepo.findOneByIdAndUser).toHaveBeenCalledWith(
      'uuid-1',
      'user-1',
    );
  });

  it('should throw NotFoundException when task not found', async () => {
    mockRepo.findOneByIdAndUser.mockResolvedValue(null);

    await expect(service.findOne('uuid-1', 'user-1')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should create a new task', async () => {
    const dto: CreateTaskDto = { title: 'Test', description: 'Desc' } as any;
    const mockTask = {
      id: 'uuid-1',
      title: 'Test task',
      userId: 'user-1',
    } as any;
    mockRepo.createTask.mockResolvedValue(mockTask);

    const result = await service.create(dto, 'user-1');

    expect(result).toEqual(mockTask);
    expect(mockRepo.createTask).toHaveBeenCalledWith(dto, 'user-1');
  });

  it('should delete a task', async () => {
    mockRepo.softDelete.mockResolvedValue({ affected: 1 });

    await service.delete('task-1', 'user-1');

    expect(mockRepo.softDelete).toHaveBeenCalledWith('task-1', 'user-1');
  });

  it('should throw NotFoundException when task to delete is not found', async () => {
    mockRepo.softDelete.mockResolvedValue({ affected: 0 });

    await expect(service.delete('task-1', 'user-1')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should return { affected: 0 } when empty ids array is passed', async () => {
    const mockResult = { affected: 0 };

    const result = await service.bulkComplete([], 'user-1');

    expect(result).toEqual(mockResult);
    expect(mockRepo.bulkUpdateStatus).not.toHaveBeenCalledWith(
      [],
      'user-1',
      'done',
    );
  });

  it(' should return { affected: 2 } when 2 tasks are completed', async () => {
    const mockResult = { affected: 2 };
    const ids = ['task-1', 'task-2'];
    mockRepo.bulkUpdateStatus.mockResolvedValue(mockResult);

    const result = await service.bulkComplete(ids, 'user-1');

    expect(result).toEqual(mockResult);
    expect(mockRepo.bulkUpdateStatus).toHaveBeenCalledWith(
      ids,
      'user-1',
      TaskStatus.DONE,
    );
  });

  it('should update and return the task when found', async () => {
    const dto: UpdateTaskDto = { title: 'update-task' };
    const mockTask = {
      id: 'uuid-1',
      title: 'Test task',
      userId: 'user-1',
    } as any;
    mockRepo.findOneByIdAndUser.mockResolvedValue(mockTask);
    mockRepo.saveTask.mockResolvedValue(mockTask);

    const result = await service.update('task-1', 'user-1', dto);

    expect(result).toEqual(mockTask);
    expect(mockRepo.findOneByIdAndUser).toHaveBeenCalledWith(
      'task-1',
      'user-1',
    );
    expect(mockRepo.saveTask).toHaveBeenCalledWith(mockTask);
  });

  it('should throw NotFoundException when task not found', async () => {
    const dto: UpdateTaskDto = { title: 'update-task' };
    mockRepo.findOneByIdAndUser.mockResolvedValue(null);

    await expect(service.update('task-1', 'user-1', dto)).rejects.toThrow(
      NotFoundException,
    );
    expect(mockRepo.findOneByIdAndUser).toHaveBeenCalledWith(
      'task-1',
      'user-1',
    );
  });
});
