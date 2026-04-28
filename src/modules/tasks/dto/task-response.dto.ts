import { TaskPriority, TaskStatus } from '../enums/task.enum';

export class TaskResponseDto {
  id!: string;
  title!: string;
  description!: string | null;
  status!: TaskStatus;
  priority!: TaskPriority;
  dueDate!: Date | null;
  createdAt!: Date;
  updatedAt!: Date;
}
