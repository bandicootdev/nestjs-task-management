import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { timingSafeEqual } from 'crypto';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';
import { TaskStatus } from './tasks.model';

// export interface TasksServiceInterface {
//   getAllTasks(): Task[];
//   getTaskById(id: string): Task;
//   createTask(createTaskDto: CreateTaskDto): Task;
//   updateTask(id: string, updateTaskDto: UpdateTaskDto): Task;
//   deleteTaskById(id: string): void;
// }

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository) private taskRepository: TaskRepository,
  ) {}

  getTasks(filterDto: GetTaskFilterDto): Promise<Task[]> {
    return this.taskRepository.getTasks(filterDto);
  }
  async getTaskById(id: string): Promise<Task> {
    const task = await this.taskRepository.findOne(id);
    if (!task) {
      throw new NotFoundException(`task with ID: ${id} not found`);
    }
    return task;
  }

  createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto);
  }

  async updateTask(id: string, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(id);
    task.status = status;
    await this.taskRepository.save(task);
    return task;
  }

  async deleteTaskById(id: string): Promise<void> {
    const task = await this.taskRepository.delete(id);
    if (task.affected === 0) {
      throw new NotFoundException(`Task with ID ${id} not found!`);
    }
  }
}
