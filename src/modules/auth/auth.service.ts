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

        return {
            ...userWithoutPass,
            accessToken: token,
        };
    }

    async signup(signupDto: SignupDto) {
        const data = { ...signupDto, roleId: 2 };
        return this.usersService.create(data as any);
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
