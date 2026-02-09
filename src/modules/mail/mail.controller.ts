import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { MailService } from './mail.service';
import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

class SendTestEmailDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    name: string;
}

@ApiTags('Mail')
@Controller('mail')
export class MailController {
    constructor(private readonly mailService: MailService) { }

    @Post('health')
    @ApiOperation({ summary: 'Send a test email to verify SMTP configuration' })
    @ApiBody({ type: SendTestEmailDto })
    async sendTestEmail(@Body() body: SendTestEmailDto) {
        await this.mailService.sendTestEmail(body.email, body.name);
        return { message: 'Test email sent successfully' };
    }
}
