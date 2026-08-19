import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProjectsModule } from './projects/projects.module';
import { TasksModule } from './tasks/tasks.module';

import { User } from './users/entities/user.entity';
import { Project } from './projects/entities/project.entity';
import { Task } from './tasks/entities/task.entity';
import { Tag } from './tags/entities/tag.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME', 'postgres'),
        password: configService.get<string>('DB_PASSWORD', ''),
        database: configService.get<string>(
          'DB_DATABASE',
          'task_manager_db',
        ),
        entities: [User, Project, Task, Tag],
        synchronize: false,
      }),
    }),

    AuthModule,
    UsersModule,
    ProjectsModule,
    TasksModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}