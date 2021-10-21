import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TaskRepository } from './task.repository';
import { TaskStatus } from './tasks.model';
import { NotFoundException } from '@nestjs/common';

const mockTasksRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
});

const mockUser = {
  id: '1',
  username: 'thaymerapv',
  password: '123456',
  tasks: [],
};

describe('TaskService', () => {
  let tasksService: TasksService;
  let taskRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TaskRepository, useFactory: mockTasksRepository },
      ],
    }).compile();
    tasksService = module.get(TasksService);
    taskRepository = module.get(TaskRepository);
  });

  describe('getTasks', () => {
    it('calls TasksRepository.getTasks and returns the result', async () => {
      // expect(taskRepository.getTasks).not.toHaveBeenCalled();
      // expect(taskRepository.getTasks).toHaveBeenCalled();
      taskRepository.getTasks.mockResolvedValue('someValue');
      const result = await tasksService.getTasks(null, mockUser);
      expect(result).toEqual('someValue');
    });
  });

  describe('getTasksById', () => {
    it('calls TasksRepository.findOne and returns the result', async () => {
      const mockTask = {
        id: '1',
        title: 'Test Tittle',
        description: 'Test Description',
        status: TaskStatus.OPEN,
      };

      taskRepository.findOne.mockResolvedValue(mockTask);
      const result = await tasksService.getTaskById('1', mockUser);
      expect(result).toEqual(mockTask);
    });

    it('calls TasksRepository.findOne and handle errors', () => {
      taskRepository.findOne.mockResolvedValue(null);
      expect(tasksService.getTaskById('1', mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
