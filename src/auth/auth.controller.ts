import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginRequestDto, LoginResponse, RegisterRequestDto } from './dto/auth.dto';
import { ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiResponse({
    status: 200,
    description: 'Login',
    type: LoginResponse,
  })
  @Post('login')
  async signIn(@Body() loginDto: LoginRequestDto): Promise<LoginResponse> {
    const token = await this.authService.login(loginDto);
    return { token };
  }

  @ApiResponse({
    status: 200,
    description: 'Register',
    type: LoginResponse,
  })
  @Post('register')
  async registerUser(@Body() registerDto: RegisterRequestDto): Promise<LoginResponse> {
    const token = await this.authService.register(registerDto);
    return { token };
  }
}
