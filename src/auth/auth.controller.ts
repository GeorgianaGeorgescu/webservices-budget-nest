import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginRequestDto, RegisterRequestDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async signIn(@Body() loginDto: LoginRequestDto) {
    const token = await this.authService.login(loginDto);
    return { token };
  }

  @Post('register')
  async registerUser(@Body() registerDto: RegisterRequestDto) {
    const token = await this.authService.register(registerDto);
    return { token };
  }
}
