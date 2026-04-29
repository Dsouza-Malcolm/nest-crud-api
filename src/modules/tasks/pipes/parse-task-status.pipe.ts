import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { TaskStatus } from '../enums/task.enum';

@Injectable()
export class ParseTaskStatusPipe implements PipeTransform {
  transform(value: unknown): undefined | TaskStatus {
    if (!value || typeof value !== 'string') return undefined;

    const status = value.toString().toLocaleLowerCase();

    if (!Object.values(TaskStatus).includes(status as TaskStatus)) {
      throw new BadRequestException(`"${status}" is not a valid TaskStatus`);
    }

    return status as TaskStatus;
  }
}
