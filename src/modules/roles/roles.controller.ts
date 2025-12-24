import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RolesService } from './roles.service';

@ApiTags('Roles')
@Controller('api/v1/user-roles')
export class RolesController {
    constructor(private readonly rolesService: RolesService) { }

    @Get()
    @ApiOperation({ summary: 'List all enabled roles' })
    @ApiResponse({ status: 200, description: 'Return all roles.' })
    async findAll() {
        const data = await this.rolesService.findAll();
        return data;
    }

    @Get(':uuid')
    @ApiOperation({ summary: 'Get a role by UUID' })
    @ApiResponse({ status: 200, description: 'Return the role.' })
    @ApiResponse({ status: 404, description: 'Role not found.' })
    async findOne(@Param('uuid') uuid: string) {
        const data = await this.rolesService.findOne(uuid);
        return data;
    }
}
