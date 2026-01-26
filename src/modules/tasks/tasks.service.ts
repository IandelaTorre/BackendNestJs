import { Injectable, NotFoundException } from '@nestjs/common';
import { TasksRepository } from './tasks.repository';
import { CreateTaskDto, UpdateTaskDto } from './dto/tasks.dto';

@Injectable()
export class TasksService {
    constructor(private readonly repository: TasksRepository) { }

    async findAll(include: string = '') {
        const includeParams = include.split(',').filter(Boolean);
        return this.repository.findAll(includeParams);
    }

    async findOne(id: number, include: string = '') {
        const includeParams = include.split(',').filter(Boolean);
        const task = await this.repository.findById(id, includeParams);
        if (!task) throw new NotFoundException('Task not found');
        return task;
    }

    async create(data: CreateTaskDto) {
        const { assignedByUuid, ...rest } = data;
        const [task] = await this.repository.create({ ...rest, assignedByUuid: assignedByUuid || null });
        return task;
    }

    async update(id: number, data: UpdateTaskDto) {
        const [updated] = await this.repository.update(id, data);
        if (!updated) throw new NotFoundException('Task not found');
        return updated;
    }

    async remove(id: number) {
        await this.repository.softDelete(id);
    }
}
