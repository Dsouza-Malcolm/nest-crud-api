import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class TrimStringPipe implements PipeTransform {
  transform(value: unknown, metadata: ArgumentMetadata) {
    if (metadata.type !== 'body') {
      return value;
    }

    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return value;
    }

    console.log({
      place: 'trim-string-pipe',
      value,
      metadata,
    });

    const obj = value as Record<string, unknown>;
    const trimmed: Record<string, unknown> = {};

    for (const key in obj) {
      const val = obj[key];

      trimmed[key] = typeof val === 'string' ? val.trim() : val;
    }

    return trimmed;
  }
}
