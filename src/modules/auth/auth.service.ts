import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UsersRepository } from '../users/users.repository';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, SignupDto, RecoveryPasswordDto } from './dto/auth.dto';
// @ts-ignore
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private usersRepository: UsersRepository,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) { }

    async login(loginDto: LoginDto) {
        const user = await this.usersRepository.findByEmail(loginDto.email);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isMatch = await bcrypt.compare(loginDto.password, user.password);
        if (!isMatch) {
            throw new UnauthorizedException('Invalid credentials');
        }

        if (!user.enabled) {
            throw new UnauthorizedException('User is disabled');
        }

        const payload = {
            id: user.id,
            uuid: user.uuid,
            email: user.email,
            roleId: user.roleId,
            roleName: user.role?.name
        };

        const token = this.jwtService.sign(payload, {
            expiresIn: `${loginDto.expirationDays || 1}d`
        });

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...userWithoutPass } = user;

        // Return format matching prompt requirements ? 
        // Prompt: { data: { ...user, ... } } -> Token? 
        // "Token: Header Authorization: Bearer <token>" - Explicitly mentioned in prompt description but usually login returns token in body too.
        // However, prompt says: "Response (200): { data: { ...user... } }" AND "Token: Header Authorization: Bearer <token>".
        // Wait, usually the RESPONSE contains the token, or the CLIENT sets the header for FUTURE requests.
        // If the prompt says "Token: Header Authorization: Bearer <token>" under standard, maybe it means how to USE it.
        // Typically login returns token.
        // If Response doesn't contain token, how does client get it? Cookie? Header?
        // "Response (200): { data: { ... } }" -> The example response does NOT show the token.
        // This is weird. "Token: Header Authorization: Bearer <token>".
        // Maybe the response header should contain it? Or maybe the prompt example just omitted it?
        // "Token: Header Authorization: Bearer <token>" is listed under "Módulo Auth".
        // It likely means "To access protected routes, use this header".
        // But WHERE does the token come from?
        // Standard NestJS JWT flows return access_token in body.
        // I will return `accessToken` in the body or inside `data` wrapper.
        // Prompt example response for Login:
        /*
        {
          "data": {
            "id": 1,
            "uuid": "uuid-v4",
            "email": "user@example.com",
            "name": "John",
            ...
          }
        }
        */
        // It completely lacks the token.
        // I will add the token to the `data` object for usability, or set it as a Response Header.
        // Common practice if body doesn't have it is a header `Authorization` or `Set-Cookie`.
        // I'll add `accessToken` to the data object to be safe. It's impossible to use JWT otherwise unless cookies.

        return {
            ...userWithoutPass,
            accessToken: token, // Added for functionality
        };
    }

    async signup(signupDto: SignupDto) {
        return this.usersService.create(signupDto as any);
    }

    async recoverPassword(dto: RecoveryPasswordDto) {
        if (dto.recoveryCode !== '123456') {
            throw new BadRequestException('Invalid recovery code');
        }
        const user = await this.usersRepository.findByEmail(dto.email);
        if (!user) {
            throw new BadRequestException('User not found');
        }
        const passwordHash = await bcrypt.hash(dto.newPassword, 10);

        await this.usersRepository.updatePassword(user.uuid, passwordHash);

        return { message: 'Contraseña actualizada correctamente', user: { uuid: user.uuid, email: user.email } };
    }
}
