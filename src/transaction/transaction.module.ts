import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { PlaceService } from 'src/place/place.service';

@Module({ imports:[
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
    ],
  providers: [TransactionService, PlaceService],
  controllers: [TransactionController],})
export class TransactionModule {}
