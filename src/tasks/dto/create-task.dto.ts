import {
  IsString,
  MinLength,
  IsEnum,
  IsOptional,
  IsInt,
  Min,
  Max,
  IsArray,
} from 'class-validator';
import { TaskStatus } from '../entities/task.entity';

export class CreateTaskDto {
  @IsString()
  @MinLength(3, { message: 'Title must be at least 3 characters long' })
  title: string;

  @IsString()
  description: string;

  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus = TaskStatus.TODO;

  @IsInt()
  @Min(1)
  @Max(5)
  priority: number;

  @IsInt()
  projectId: number;

  @IsInt()
  @IsOptional()
  assigneeId?: number;

  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  tagIds?: number[];
}