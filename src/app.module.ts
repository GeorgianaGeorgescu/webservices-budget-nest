import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './data/prisma.module';
import { PasswordModule } from './auth/password.module';
import serverConfig from 'config/server.config';
import tokenConfig from 'config/token.config';
import { LoggerMiddleware } from './core/logger.middleware';
import { TransactionModule } from './transaction/transaction.module';
import { PlaceModule } from './place/place.module';
import { HealthController } from './health/health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [ serverConfig, tokenConfig],
      envFilePath: ['.env.development', '.env'],
      isGlobal: true,
    }),
    UserModule,
    AuthModule,
    PrismaModule,
    PasswordModule,
    TransactionModule,
    PlaceModule,
  ],
  controllers: [HealthController],
})
export class AppModule {
 configure(consumer: MiddlewareConsumer) {
    const isLoggingDisabled = process.env.LOG_DISABLED === 'true';

    if (!isLoggingDisabled) {
      consumer.apply(LoggerMiddleware).forRoutes('*');
    }
  }
}
