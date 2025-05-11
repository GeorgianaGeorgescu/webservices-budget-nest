import { registerAs } from '@nestjs/config';

export const ServerConfigName = 'server';

export default registerAs(ServerConfigName, () => ({
  nodeEnv: process.env.NODE_ENV,
  port: parseInt(process.env.PORT || '3000'),
  auth: {
    hashLength: parseInt(process.env.HASH_LENGTH || '32'),
    timeCost: parseInt(process.env.HASH_TIME_COST || '6'),
    memoryCost: parseInt(process.env.HASH_MEMORY_COST || '65536'),
  },
  
}));