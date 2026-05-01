import { NotFoundException } from '@nestjs/common';
import { TaskRepository } from './repositories/task.repository';
import { TasksService } from './tasks.service';

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
});
