import { forwardRef, Module } from '@nestjs/common';
import { PlaceService } from './place.service';
import { PlaceController } from './place.controller';
import { TransactionModule } from '../transaction/transaction.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    forwardRef(() => TransactionModule),
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
  providers: [PlaceService],
  controllers: [PlaceController],
  exports:[PlaceService],
})
export class PlaceModule {}
