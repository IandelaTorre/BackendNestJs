import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { TasksRepository } from './tasks.repository';
import { CreateTaskDto, UpdateTaskDto } from './dto/tasks.dto';
import { UsersRepository } from '../users/users.repository';

@Injectable()
export class TasksService {
    constructor(
        private readonly repository: TasksRepository,
        private readonly usersRepository: UsersRepository,
    ) { }

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

    async findByUserUuid(uuid: string, include: string = '') {
        const includeParams = include.split(',').filter(Boolean);
        const tasks = await this.repository.findByUserUuid(uuid, includeParams);
        return tasks;
    }

    private async validateAndGetUserCode(code: string): Promise<string> {
        const user = await this.usersRepository.findByUserCode(code);
        if (!user) throw new BadRequestException(`User with code ${code} not found`);
        return user.userCode; // Return the exact casing from DB
    }

    async create(data: CreateTaskDto) {
        const { assignedByCode, assignedToCode, ...rest } = data;

        const validAssignedToCode = await this.validateAndGetUserCode(assignedToCode);
        let validAssignedByCode: string | null = null;

        if (assignedByCode) {
            validAssignedByCode = await this.validateAndGetUserCode(assignedByCode);
        }

        const [task] = await this.repository.create({
            ...rest,
            assignedToCode: validAssignedToCode,
            assignedByCode: validAssignedByCode
        });
        return task;
    }

    async update(id: number, data: UpdateTaskDto) {
        // If updating assignment, validate codes
        if (data.assignedToCode) {
            data.assignedToCode = await this.validateAndGetUserCode(data.assignedToCode);
        }
        if (data.assignedByCode) {
            data.assignedByCode = await this.validateAndGetUserCode(data.assignedByCode);
        }

        const [updated] = await this.repository.update(id, data);
        if (!updated) throw new NotFoundException('Task not found');
        return updated;
    }

    async remove(id: number) {
        await this.repository.softDelete(id);
    }
}
