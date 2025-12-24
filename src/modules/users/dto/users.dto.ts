import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const CreateUserSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6), // In real app, enforce complexity
    name: z.string().optional(),
    lastName: z.string().optional(),
    secondLastName: z.string().optional(),
    roleId: z.number().int().positive().optional().default(2), // Default to user
});

export const UpdateUserSchema = CreateUserSchema.partial().omit({ password: true });

class CreateUserDtoBase extends createZodDto(CreateUserSchema) { }
export class CreateUserDto extends CreateUserDtoBase { }

class UpdateUserDtoBase extends createZodDto(UpdateUserSchema) { }
export class UpdateUserDto extends UpdateUserDtoBase { }
