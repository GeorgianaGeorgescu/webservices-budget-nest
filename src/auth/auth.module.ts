import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PasswordModule } from './password.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('AUTH_JWT_SECRET'),
        signOptions: {
          expiresIn: `${configService.get<number>('AUTH_JWT_EXPIRATION_INTERVAL', 3600)}s`,
        },
      }),
    }),
    PasswordModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
