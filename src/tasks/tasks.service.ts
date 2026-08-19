import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Task } from './entities/task.entity';
import { Project } from '../projects/entities/project.entity';
import { User } from '../users/entities/user.entity';
import { Tag } from '../tags/entities/tag.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FilterTaskDto } from './dto/filter-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Tag)
    private readonly tagRepo: Repository<Tag>,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const project = await this.projectRepo.findOneBy({ id: createTaskDto.projectId });
    if (!project) throw new NotFoundException(`Project #${createTaskDto.projectId} not found`);

    let assignee: User | null = null;
    if (createTaskDto.assigneeId) {
      assignee = await this.userRepo.findOneBy({ id: createTaskDto.assigneeId });
      if (!assignee) throw new NotFoundException(`User #${createTaskDto.assigneeId} not found`);
    }

    let tags: Tag[] = [];
    if (createTaskDto.tagIds && createTaskDto.tagIds.length > 0) {
      tags = await this.tagRepo.findBy({ id: In(createTaskDto.tagIds) });
    }

    const task = this.taskRepo.create({
      ...createTaskDto,
      project,
      assignee,
      tags,
    });

    return this.taskRepo.save(task);
  }

  async findAll(filters: FilterTaskDto): Promise<Task[]> {
    const query = this.taskRepo.createQueryBuilder('task')
      .leftJoinAndSelect('task.project', 'project')
      .leftJoinAndSelect('task.assignee', 'assignee')
      .leftJoinAndSelect('task.tags', 'tags');

    if (filters.status) {
      query.andWhere('task.status = :status', { status: filters.status });
    }
    if (filters.projectId) {
      query.andWhere('project.id = :projectId', { projectId: filters.projectId });
    }
    if (filters.assigneeId) {
      query.andWhere('assignee.id = :assigneeId', { assigneeId: filters.assigneeId });
    }

    return query.getMany();
  }

async findOne(id: number): Promise<Task> {
    const task = await this.taskRepo.findOne({
      where: { id },
      relations: {
        project: true,
        assignee: true,
        tags: true,
      },
    });
    if (!task) throw new NotFoundException(`Task #${id} not found`);
    return task;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id);

    if (updateTaskDto.projectId) {
      const project = await this.projectRepo.findOneBy({ id: updateTaskDto.projectId });
      if (!project) throw new NotFoundException(`Project #${updateTaskDto.projectId} not found`);
      task.project = project;
    }

    if (updateTaskDto.assigneeId !== undefined) {
      if (updateTaskDto.assigneeId === null) {
        task.assignee = null;
      } else {
        const assignee = await this.userRepo.findOneBy({ id: updateTaskDto.assigneeId });
        if (!assignee) throw new NotFoundException(`User #${updateTaskDto.assigneeId} not found`);
        task.assignee = assignee;
      }
    }

    if (updateTaskDto.tagIds) {
      task.tags = await this.tagRepo.findBy({ id: In(updateTaskDto.tagIds) });
    }

    Object.assign(task, updateTaskDto);
    return this.taskRepo.save(task);
  }

  async remove(id: number): Promise<void> {
    const task = await this.findOne(id);
    await this.taskRepo.remove(task);
  }
}