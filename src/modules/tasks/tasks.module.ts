import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TasksRepository } from './tasks.repository';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [UsersModule],
    controllers: [TasksController],
    providers: [TasksService, TasksRepository],
    exports: [TasksService],
})
export class TasksModule { }
