import { Module } from '@nestjs/common';
import { UserLogsService } from './user-logs.service';
import { UserLogsRepository } from './user-logs.repository';

@Module({
    providers: [UserLogsService, UserLogsRepository],
    exports: [UserLogsService],
})
export class UserLogsModule { }
