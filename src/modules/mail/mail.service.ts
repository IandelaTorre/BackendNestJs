import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
    private transporter: nodemailer.Transporter;
    private readonly logger = new Logger(MailService.name);

    constructor(private configService: ConfigService) {
        this.transporter = nodemailer.createTransport({
            host: this.configService.get<string>('smtpHost'),
            port: this.configService.get<number>('smtpPort'),
            secure: false,
            auth: {
                user: this.configService.get<string>('smtpUser'),
                pass: this.configService.get<string>('smtpPass'),
            },
            tls: {
                rejectUnauthorized: false
            }
        });
    }

    async sendMail(to: string, subject: string, html: string) {
        try {
            const info = await this.transporter.sendMail({
                from: `"${this.configService.get<string>('smtpUser')}" <${this.configService.get<string>('smtpUser')}>`,
                to,
                subject,
                html,
            });
            this.logger.log(`Message sent: ${info.messageId}`);
            return info;
        } catch (error) {
            this.logger.error(`Error sending email to ${to}: ${error.message}`, error.stack);
            throw error;
        }
    }

    async sendTestEmail(to: string, name: string) {
        const subject = 'Health Check - NestJS Backend Starter';
        const html = `
      <h1>Hola ${name},</h1>
      <p>Que tengas buen día.</p>
      <p>Health check passed successfully.</p>
    `;
        return this.sendMail(to, subject, html);
    }
}
