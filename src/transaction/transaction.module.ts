import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { PlaceModule } from '../place/place.module';

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
      forwardRef(() => PlaceModule),
    ],
  providers: [TransactionService],
  controllers: [TransactionController],
  exports:[TransactionService],
})
export class TransactionModule {}