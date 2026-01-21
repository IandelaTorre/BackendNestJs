import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const CreateTaskSchema = z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    statusId: z.number().int().positive(),
    assignedTo: z.string().uuid(),
    assignedBy: z.string().uuid().optional(),
});

export const UpdateTaskSchema = CreateTaskSchema.partial().extend({
    isActive: z.boolean().optional(),
});

class CreateTaskDtoBase extends createZodDto(CreateTaskSchema) { }
export class CreateTaskDto extends CreateTaskDtoBase { }

class UpdateTaskDtoBase extends createZodDto(UpdateTaskSchema) { }
export class UpdateTaskDto extends UpdateTaskDtoBase { }
