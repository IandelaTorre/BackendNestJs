import { Controller, Post, Body, UsePipes, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, SignupDto, RecoveryPasswordDto, LoginSchema, SignupSchema, RecoveryPasswordSchema } from './dto/auth.dto';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('api/v1/auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    @ApiOperation({ summary: 'Login user' })
    @HttpCode(200)
    @UsePipes(new ZodValidationPipe(LoginSchema))
    async login(@Body() loginDto: LoginDto) {
        const data = await this.authService.login(loginDto);
        return data;
    }

    @Post('signup')
    @ApiOperation({ summary: 'Register user' })
    @UsePipes(new ZodValidationPipe(SignupSchema))
    async signup(@Body() signupDto: SignupDto) {
        const data = await this.authService.signup(signupDto);
        return data;
    }

    @Post('recovery-password')
    @ApiOperation({ summary: 'Recover password' })
    @HttpCode(200)
    @UsePipes(new ZodValidationPipe(RecoveryPasswordSchema))
    async recoverPassword(@Body() recoveryDto: RecoveryPasswordDto) {
        const data = await this.authService.recoverPassword(recoveryDto);
        return data;
    }
}
