import { Injectable, NotFoundException } from '@nestjs/common';
import { RolesRepository } from './roles.repository';

@Injectable()
export class RolesService {
    constructor(private readonly repository: RolesRepository) { }

    async findAll() {
        return this.repository.findAll();
    }

    async findOne(uuid: string) {
        const role = await this.repository.findByUuid(uuid);
        if (!role) {
            throw new NotFoundException(`Role with UUID ${uuid} not found`);
        }
        return role;
    }
}
