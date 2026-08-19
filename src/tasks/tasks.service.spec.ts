import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TasksService } from './tasks.service';
import { Task, TaskStatus } from './entities/task.entity';
import { Project } from '../projects/entities/project.entity';
import { User } from '../users/entities/user.entity';
import { Tag } from '../tags/entities/tag.entity';
import { NotFoundException } from '@nestjs/common';

describe('TasksService', () => {
  let service: TasksService;
  let taskRepo: jest.Mocked<Partial<Repository<Task>>>;
  let projectRepo: jest.Mocked<Partial<Repository<Project>>>;
  let userRepo: jest.Mocked<Partial<Repository<User>>>;
  let tagRepo: jest.Mocked<Partial<Repository<Tag>>>;

  beforeEach(async () => {
    taskRepo = { create: jest.fn(), save: jest.fn() };
    projectRepo = { findOneBy: jest.fn() };
    userRepo = { findOneBy: jest.fn() };
    tagRepo = { findBy: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: getRepositoryToken(Task), useValue: taskRepo },
        { provide: getRepositoryToken(Project), useValue: projectRepo },
        { provide: getRepositoryToken(User), useValue: userRepo },
        { provide: getRepositoryToken(Tag), useValue: tagRepo },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  it('should create a task successfully when referenced entities exist', async () => {
    const dto = {
      title: 'Build API Tests',
      description: 'Write unit tests for TasksService',
      priority: 1,
      projectId: 1,
      assigneeId: 2,
    };

    const mockProject = { id: 1 } as Project;
    const mockUser = { id: 2 } as User;
    const mockTask = { id: 10, ...dto } as unknown as Task;

    projectRepo.findOneBy.mockResolvedValue(mockProject);
    userRepo.findOneBy.mockResolvedValue(mockUser);
    taskRepo.create.mockReturnValue(mockTask);
    taskRepo.save.mockResolvedValue(mockTask);

    const result = await service.create(dto);
    expect(result).toEqual(mockTask);
  });

  it('should throw 404 NotFoundException if project does not exist', async () => {
    projectRepo.findOneBy.mockResolvedValue(null);

    await expect(
      service.create({
        title: 'Task Title',
        description: 'Test description',
        priority: 2,
        projectId: 999,
      }),
    ).rejects.toThrow(NotFoundException);
  });
});