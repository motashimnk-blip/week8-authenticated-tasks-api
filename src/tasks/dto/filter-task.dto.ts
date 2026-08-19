import { IsOptional, IsEnum, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { TaskStatus } from '../entities/task.entity';

export class FilterTaskDto {
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  projectId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  assigneeId?: number;
}