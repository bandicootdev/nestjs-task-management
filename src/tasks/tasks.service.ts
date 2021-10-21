import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { timingSafeEqual } from 'crypto';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';
import { TaskStatus } from './tasks.model';
import { Auth } from '../auth/user.entity';

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

  getTasks(filterDto: GetTaskFilterDto, user: Auth): Promise<Task[]> {
    return this.taskRepository.getTasks(filterDto, user);
  }
  async getTaskById(id: string, user: Auth): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id, user } });
    if (!task) {
      throw new NotFoundException(`task with ID: ${id} not found`);
    }
    return task;
  }

  createTask(createTaskDto: CreateTaskDto, user: Auth): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, user);
  }

  async updateTask(id: string, status: TaskStatus, user: Auth): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = status;
    await this.taskRepository.save(task);
    return task;
  }

  async deleteTaskById(id: string, user: Auth): Promise<void> {
    const task = await this.taskRepository.delete({ id, user });
    if (task.affected === 0) {
      throw new NotFoundException(`Task with ID ${id} not found!`);
    }
  }
}
