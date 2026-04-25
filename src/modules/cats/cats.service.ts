import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Cat } from './interfaces/cat.interface.js';

@Injectable()
export class CatsService {
  private readonly cats: Cat[] = [];

  create(cat: Cat) {
    this.cats.push(cat);
    throw new ForbiddenException();
  }

  findAll(): Cat[] {
    if (this.cats.length === 0) throw new NotFoundException();
    return this.cats;
  }

  findOne(id: number): Cat | null {
    const cat = this.cats.find((cat) => cat.age === id);
    return cat ? cat : null;
  }
}
