import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto, UpdateUserDto } from './dto/users.dto';
import { CodeGeneratorUtil } from '../../utils/code-generator.util';
// @ts-ignore
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(private readonly repository: UsersRepository) { }

    async create(data: CreateUserDto) {
        const existing = await this.repository.findByEmail(data.email);
        if (existing) {
            throw new BadRequestException('Email already exists');
        }

        const passwordHash = await bcrypt.hash(data.password, 10);
        const userCode = CodeGeneratorUtil.generateUserCode(data.name || 'USER');

        // Simple retry logic for userCode collision could go here (omitted for brevity)

        const [user] = await this.repository.create({ ...data, passwordHash, userCode });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...result } = user;
        return result;
    }

    async findAll() {
        return this.repository.findAll();
    }

    async findOne(uuid: string) {
        const user = await this.repository.findByUuid(uuid);
        if (!user) throw new NotFoundException('User not found');
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...result } = user;
        return result;
    }

    async findByEmail(email: string) {
        const user = await this.repository.findByEmail(email);
        if (!user) throw new NotFoundException('User not found');
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...result } = user;
        return result;
    }

    async update(uuid: string, data: UpdateUserDto) {
        const [updated] = await this.repository.update(uuid, data);
        if (!updated) throw new NotFoundException('User not found');
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...result } = updated;
        return result;
    }

    async remove(uuid: string) {
        await this.repository.softDelete(uuid);
    }
}
