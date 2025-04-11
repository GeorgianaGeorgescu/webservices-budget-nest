import { registerAs } from '@nestjs/config';

export const TokenConfigName = 'token';

export default registerAs(TokenConfigName, () => ({
  jwt: {
    expirationInterval: Number(process.env.AUTH_JWT_EXPIRATION_INTERVAL) || 3600,
    secret: process.env.AUTH_JWT_SECRET || '',
    audience: process.env.AUTH_JWT_AUDIENCE || 'budget.hogent.be',
    issuer: process.env.AUTH_JWT_ISSUER || 'budget.hogent.be', 
  },
}));
