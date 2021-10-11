import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task, TaskStatus } from './tasks.model';

export interface TasksServiceInterface {
  getAllTasks(): Task[];
  getTaskById(id: string): Task;
  createTask(createTaskDto: CreateTaskDto): Task;
  updateTask(id: string, updateTaskDto: UpdateTaskDto): Task;
  deleteTaskById(id: string): void;
}

@Injectable()
export class TasksService implements TasksServiceInterface {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTaskByFilter(filter: GetTaskFilterDto): Task[] {
    const { status, search } = filter;
    let tasks = this.getAllTasks();
    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }

    if (search) {
      tasks = tasks.filter((task) => {
        if (task.title.includes(search) || task.description.includes(search)) {
          return true;
        }
        return false;
      });
    }
    return tasks;
  }
  getTaskById(id: string): Task {
    const task = this.tasks.find((task: Task) => task.id === id);

    if (!task) {
      throw new NotFoundException(`task with ID: ${id} not found`);
    }

    return task;
  }
  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;
    const task: Task = {
      id: Math.floor(Math.random() * 1000).toString(),
      title,
      description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);
    return task;
  }

  updateTask(id: string, updateTaskDto: UpdateTaskDto): Task {
    const task = this.getTaskById(id);
    task.status = updateTaskDto.status;
    return task;
  }

  deleteTaskById(id: string): Task {
    const taskFound = this.getTaskById(id);

    const tasks = this.tasks.filter((task: Task) => task.id !== taskFound.id);
    this.tasks.slice(0, this.tasks.length);
    this.tasks = [...tasks];
    return taskFound;
  }
}
