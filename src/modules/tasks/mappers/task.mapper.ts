import { TaskResponseDto } from '../dto/task-response.dto';
import { Task } from '../entities/task.entity';

export class TaskMapper {
  static toResponse(task: Task): TaskResponseDto {
    return {
      id: task.id,
      title: task.title,
      description: task?.description,
      dueDate: task.dueDate,
      status: task.status,
      priority: task.priority,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    };
  }
}
