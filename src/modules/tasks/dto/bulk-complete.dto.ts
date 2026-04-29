import { IsArray, IsUUID } from 'class-validator';

export class BulkCompleteDto {
  @IsArray()
  @IsUUID('4', { each: true })
  ids!: string[];
}
