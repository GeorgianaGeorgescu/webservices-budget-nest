import * as argon2 from 'argon2';

const hashLength = parseInt(process.env.HASH_LENGTH || '32'); 
const timeCost = parseInt(process.env.HASH_TIME_COST || '3');
const memoryCost = parseInt(process.env.HASH_MEMORY_COST || '65536');

export const hashPassword = async (password: string): Promise<string> => {
  return argon2.hash(password, {
    type: argon2.argon2id,
    hashLength,
    timeCost,
    memoryCost,
  });
};

export const verifyPassword = async (
  password: string,
  passwordHash: string,
): Promise<boolean> => {
  return argon2.verify(passwordHash, password);
};
