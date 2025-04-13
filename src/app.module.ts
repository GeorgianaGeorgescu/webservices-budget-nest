import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './data/prisma.module';
import { PasswordModule } from './auth/password.module';
import serverConfig from 'config/server.config';
import tokenConfig from 'config/token.config';
import { LoggerMiddleware } from './core/logger.middleware';

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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*');
  }
}
