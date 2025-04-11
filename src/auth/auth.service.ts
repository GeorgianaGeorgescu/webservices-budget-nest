import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginRequestDto, RegisterRequestDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/data/prisma.service';
import { PasswordService } from './password.service';
import Role from '../core/roles';
import { handleDBError } from 'src/core/handleDBError';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
    private passwordService: PasswordService,
  ) {}

  async login(dto: LoginRequestDto): Promise<string> {
    const { email, password } = dto;

    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('The given email and password do not match');
    }
    const passwordValid = await this.passwordService.verifyPassword(
      password,
      user.password_hash,
    );

    if (!passwordValid) {
      throw new UnauthorizedException('The given email and password do not match');
    }

    const payload = { sub: user.id, email: user.email, roles: user.roles };
    return this.jwtService.sign(payload);
  }

  async register(dto: RegisterRequestDto): Promise<string> {
    const { name, email, password } = dto;

    try {
      
      const passwordHash = await this.passwordService.hashPassword(password);

      const user = await this.prisma.user.create({
        data: {
          name,
          email,
          password_hash: passwordHash,
          roles: [Role.USER],
        },
      });
      const payload = { sub: user.id, email: user.email, roles: user.roles };
      return this.jwtService.sign(payload);
    } catch (error) {
      throw handleDBError(error);
      
    }
  }
}
