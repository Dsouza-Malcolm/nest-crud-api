import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class TrimStringPipe implements PipeTransform {
  transform(value: unknown, metadata: ArgumentMetadata) {
    console.log({
      value,
      metadata,
    });

    if (typeof value !== 'object' || !value) {
      return value;
    }

    for (const key in value) {
      if (typeof value[key] === 'string') {
        value[key] = value[key].trim();
      }
    }

    return value;
  }
}
