export interface ServerConfig {
  nodeEnv: string;
  port: number;
  auth: {
    hashLength: number;
    timeCost: number;
    memoryCost: number;
  };
}

export interface TokenConfig {
  jwt: {
    expirationInterval: number;
    secret: string;
    audience: string;
    issuer: string;
  };
}


