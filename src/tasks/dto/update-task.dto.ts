import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { TaskStatus } from '../tasks.model';

export class UpdateTaskDto {
  @IsNotEmpty()
  id: string;

  @IsEnum(TaskStatus)
  @IsString()
  status: TaskStatus;
}
