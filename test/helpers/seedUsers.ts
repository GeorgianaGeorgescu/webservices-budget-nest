import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../../src/core/password';

export async function seedUsers(prisma:PrismaClient) {
  const passwordHash = await hashPassword('12345678');

  await prisma.user.createMany({
    data: [
      {
        id: 1,
        name: 'Test User',
        email: 'test.user@hogent.be',
        password_hash: passwordHash,
        roles: JSON.stringify(['USER']),
      },
      {
        id: 2,
        name: 'Admin User',
        email: 'admin.user@hogent.be',
        password_hash: passwordHash,
        roles: JSON.stringify(['ADMIN', 'USER']),
      },
    ],
  });
}