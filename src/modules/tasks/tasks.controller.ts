import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UsePipes, ParseIntPipe, Request, UnauthorizedException } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto, CreateTaskSchema, UpdateTaskDto, UpdateTaskSchema } from './dto/tasks.dto';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

@ApiTags('Tasks')
@Controller('api/v1/tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) { }

    @Get()
    @ApiOperation({ summary: 'List all tasks' })
    @ApiQuery({ name: 'include', required: false, description: 'Comma separated relations: status,assignedBy,assignedTo' })
    async findAll(@Query('include') include?: string) {
        return this.tasksService.findAll(include);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get task by ID' })
    @ApiQuery({ name: 'include', required: false })
    async findOne(@Param('id', ParseIntPipe) id: number, @Query('include') include?: string) {
        return this.tasksService.findOne(id, include);
    }

    @Post()
    @ApiOperation({ summary: 'Create task' })
    async create(@Body(new ZodValidationPipe(CreateTaskSchema)) createTaskDto: CreateTaskDto) {
        return this.tasksService.create(createTaskDto);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update task' })
    async update(@Param('id', ParseIntPipe) id: number, @Body(new ZodValidationPipe(UpdateTaskSchema)) updateTaskDto: UpdateTaskDto) {
        return this.tasksService.update(id, updateTaskDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Soft delete task' })
    @ApiResponse({ status: 204, description: 'Task deleted' })
    async remove(@Param('id', ParseIntPipe) id: number) {
        await this.tasksService.remove(id);
        return;
    }
}
