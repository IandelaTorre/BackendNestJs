import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
    expirationDays: z.number().int().positive().optional(),
});

export const SignupSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().optional(),
    lastName: z.string().optional(),
});

export const RecoveryPasswordSchema = z.object({
    email: z.string().email(),
    recoveryCode: z.string(), // Dummy code check
    newPassword: z.string().min(6),
});

class LoginDtoBase extends createZodDto(LoginSchema) { }
export class LoginDto extends LoginDtoBase { }

class SignupDtoBase extends createZodDto(SignupSchema) { }
export class SignupDto extends SignupDtoBase { }

class RecoveryPasswordDtoBase extends createZodDto(RecoveryPasswordSchema) { }
export class RecoveryPasswordDto extends RecoveryPasswordDtoBase { }
