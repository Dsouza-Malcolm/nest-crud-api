import { Controller, Get, NotFoundException } from '@nestjs/common';

@Controller('mock')
export class MockController {
  @Get('error')
  error() {
    throw new NotFoundException('Task not found', {
      cause: 'Task not found',
      description: 'Description task not found',
    });
  }
}
