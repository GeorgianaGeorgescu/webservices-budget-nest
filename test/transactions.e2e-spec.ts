import supertest, * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, INestApplication } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { PrismaService } from '../src/data/prisma.service';
import { AppModule } from '../src/app.module';
import { seedUsers } from './helpers/seedUsers';
import { login, loginAdmin } from './helpers/login';

describe('Transactions', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let userAuthToken: string;
  let adminAuthToken: string;

  const url = '/transactions';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
      app.useGlobalPipes(
        new ValidationPipe({
          whitelist: true,
          forbidNonWhitelisted: true,
          exceptionFactory: (errors) => {
            const formattedErrors = errors.reduce((acc, err) => {
              acc[err.property] = Object.values(err.constraints || {});
              return acc;
            }, {});
            return new BadRequestException({
              code: 'VALIDATION_FAILED',
              details: { body: formattedErrors },
            });
          },
        }),
      );
    await app.init();

    prisma = app.get(PrismaService);

    await seedUsers(prisma);
    userAuthToken = await login(request(app.getHttpServer()));
    adminAuthToken = await loginAdmin(request(app.getHttpServer()));
  });

  afterAll(async () => {
    await prisma.transaction.deleteMany();
    await prisma.place.deleteMany();
    await prisma.user.deleteMany();

    await app.close();
  });

  describe('GET /api/transactions', () => {
    beforeAll(async () => {
      await prisma.place.createMany({ data: data.places });
      await prisma.transaction.createMany({ data: data.transactions });
    });

    afterAll(async () => {
      await prisma.transaction.deleteMany({
        where: { id: { in: dataToDelete.transactions } },
      });
      await prisma.place.deleteMany({
        where: { id: { in: dataToDelete.places } },
      });
    });

    it('should return all transactions for the signed-in user', async () => {
      const res = await request(app.getHttpServer())
        .get(url)
        .set('Authorization', `Bearer ${userAuthToken}`);

      expect(res.body.length).toBe(2);
      expect(Array.isArray(res.body)).toBe(true);

      expect(res.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: 1,
            user: expect.objectContaining({ id: 1, name: 'Test User' }),
            place: expect.objectContaining({ id: 1, name: 'Test place', rating: 3 }),
            amount: 3500,
            date: new Date(2021, 4, 25, 19, 40).toISOString(),
          }),
          expect.objectContaining({
            id: 3,
            user: expect.objectContaining({ id: 1, name: 'Test User' }),
            place: expect.objectContaining({ id: 1, name: 'Test place', rating: 3 }),
            amount: -74,
            date: new Date(2021, 4, 21, 14, 30).toISOString(),
          }),
        ])
      );
    });

    it('should respond with 401 when not authenticated', async () => {
      const response = await request(app.getHttpServer()).get(url);
      expect(response.statusCode).toBe(401);
    });

    it('should respond with 401 with a malformed token', async () => {
      const response = await request(app.getHttpServer())
        .get(url)
        .set('Authorization', 'Bearer invalid-token');

      expect(response.statusCode).toBe(401);
    });    
  });
  
  describe('POST /api/transactions', () => {
    const transactionsToDelete: number[] = [];

    beforeAll(async () => {
      await prisma.place.createMany({ data: data.places });
    });

    afterAll(async () => {
      await prisma.transaction.deleteMany({
        where: { id: { in: transactionsToDelete } },
      });
      await prisma.place.deleteMany({
        where: { id: { in: dataToDelete.places } },
      });
    });

    it('should 201 and return the created transaction', async () => {
      const response = await request(app.getHttpServer())
        .post(url)
        .send({
          amount: 102,
          date: '2021-05-27T13:00:00.000Z',
          placeId: 1,
        })
        .set('Authorization', `Bearer ${userAuthToken}`);

      expect(response.status).toBe(201);
      expect(response.body.id).toBeTruthy();
      expect(response.body.amount).toBe(102);
      expect(response.body.date).toBe('2021-05-27T13:00:00.000Z');
      expect(response.body.place).toEqual({
        id: 1,
        name: 'Test place',
        rating: 3,
      });
      expect(response.body.user).toEqual({
        id: 1,
        name: 'Test User',
      });

      transactionsToDelete.push(response.body.id);
    });

    it('should 404 when place does not exist', async () => {
      const response = await request(app.getHttpServer())
        .post(url)
        .send({
          amount: 125,
          date: '2021-05-27T13:00:00.000Z',
          placeId: 123,
        })
        .set('Authorization', `Bearer ${userAuthToken}`);
 
      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        statusCode: 404,
        message: 'No place with this id exists',
        error: 'Not Found'
      });

    });

    it('should 400 when missing amount', async () => {
      const response = await request(app.getHttpServer())
        .post(url)
        .send({
          date: '2021-05-27T13:00:00.000Z',
          placeId: 1,
        })
        .set('Authorization', `Bearer ${userAuthToken}`);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('amount');
    });

    it('should 400 when missing date', async () => {
      const response = await request(app.getHttpServer())
        .post(url)
        .send({
          amount: 102,
          placeId: 1,
        })
        .set('Authorization', `Bearer ${userAuthToken}`);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('date');
    });

    it('should 400 when missing placeId', async () => {
      const response = await request(app.getHttpServer())
        .post(url)
        .send({
          amount: 102,
          date: '2021-05-27T13:00:00.000Z',
        })
        .set('Authorization', `Bearer ${userAuthToken}`);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('placeId');
    });

    it('should 401 when not authenticated', async () => {
      const response = await request(app.getHttpServer())
        .post(url)
        .send({
          amount: 102,
          date: '2021-05-27T13:00:00.000Z',
          placeId: 1,
        });

      expect(response.statusCode).toBe(401);
    });
  });

  describe('PUT /api/transactions/:id', () => {
    beforeAll(async () => {
      await prisma.place.createMany({ data: data.places });
      await prisma.transaction.createMany({ data: data.transactions });
    });

    afterAll(async () => {
      await prisma.transaction.deleteMany({
        where: { id: { in: dataToDelete.transactions } },
      });
      await prisma.place.deleteMany({
        where: { id: { in: dataToDelete.places } },
      });
    });

    it('should 200 and return the updated transaction', async () => {
      const response = await request(app.getHttpServer())
        .put(`${url}/1`)
        .send({
          amount: -125,
          date: '2021-05-27T13:00:00.000Z',
          placeId: 1,
        })
        .set('Authorization', `Bearer ${userAuthToken}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.id).toEqual(1);
      expect(response.body.amount).toBe(-125);
      expect(response.body.date).toBe('2021-05-27T13:00:00.000Z');
      expect(response.body.place).toEqual({
        id: 1,
        name: 'Test place',
        rating: 3,
      });
      expect(response.body.user).toEqual({
        id: 1,
        name: 'Test User',
      });
    });

    it('should 404 when updating not existing transaction', async () => {
      const response = await request(app.getHttpServer())
        .put(`${url}/200`)
        .send({
          amount: -125,
          date: '2021-05-27T13:00:00.000Z',
          placeId: 1,
        })
        .set('Authorization', `Bearer ${userAuthToken}`);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        message: 'No transaction with this id exists',
        error: 'Not Found',
        statusCode: 404
      });
    });

    it('should 404 when place does not exist', async () => {
      const response = await request(app.getHttpServer())
        .put(`${url}/1`)
        .send({
          amount: -125,
          date: '2021-05-27T13:00:00.000Z',
          placeId: 123,
        })
        .set('Authorization', `Bearer ${userAuthToken}`);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
         message: 'No place with this id exists',
         error: 'Not Found',
         statusCode: 404
      });
    });

    it('should 400 when missing amount', async () => {
      const response = await request(app.getHttpServer())
        .put(`${url}/1`)
        .send({
          date: '2021-05-27T13:00:00.000Z',
          placeId: 1,
        })
        .set('Authorization', `Bearer ${userAuthToken}`);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('amount');
    });

    it('should 400 when missing date', async () => {
      const response = await request(app.getHttpServer())
        .put(`${url}/1`)
        .send({
          amount: 102,
          placeId: 1,
        })
        .set('Authorization', `Bearer ${userAuthToken}`);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('date');
    });

    it('should 400 when missing placeId', async () => {
      const response = await request(app.getHttpServer())
        .put(`${url}/1`)
        .send({
          amount: 102,
          date: '2021-05-27T13:00:00.000Z',
        })
        .set('Authorization', `Bearer ${userAuthToken}`);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('placeId');
    });

    it('should 401 when not authenticated', async () => {
      const response = await request(app.getHttpServer())
        .put(`${url}/1`)
        .send({
          amount: 102,
          date: '2021-05-27T13:00:00.000Z',
          placeId: 1,
        });

      expect(response.statusCode).toBe(401);
    });
  });

  describe('DELETE /api/transactions/:id', () => {
    beforeAll(async () => {
      await prisma.place.createMany({ data: data.places });
      await prisma.transaction.create({ data: data.transactions[0]! });
    });

    afterAll(async () => {
      await prisma.place.deleteMany({
        where: { id: { in: dataToDelete.places } },
      });
    });

    it('should 204 and return nothing', async () => {
      const response = await request(app.getHttpServer())
        .delete(`${url}/1`)
        .set('Authorization', `Bearer ${userAuthToken}`);

      expect(response.statusCode).toBe(204);
      expect(response.body).toEqual({});
    });

    it('should 404 with not existing transaction', async () => {
      const response = await request(app.getHttpServer())
        .delete(`${url}/999`)
        .set('Authorization', `Bearer ${userAuthToken}`);

      expect(response.statusCode).toBe(404);

      expect(response.body).toMatchObject({
        statusCode: 404,
        message: 'No transaction with this id exists',
        error: 'Not Found'
      });
    });

    it('should 400 with invalid transaction id', async () => {
      const response = await request(app.getHttpServer())
        .delete(`${url}/invalid`)
        .set('Authorization', `Bearer ${userAuthToken}`);

      expect(response.body).toMatchObject({
        message: 'Validation failed (numeric string is expected)',
        error: 'Bad Request',
        statusCode: 400
      });
      
    });

    it('should 401 when not authenticated', async () => {
      const response = await request(app.getHttpServer()).delete(`${url}/1`);

      expect(response.statusCode).toBe(401);
    });
  });

});


const data = { 
  transactions: [
    {
      id: 1,
      user_id: 1,
      place_id: 1,
      amount: 3500,
      date: new Date(2021, 4, 25, 19, 40),
    },
    {
      id: 2,
      user_id: 2,
      place_id: 1,
      amount: -220,
      date: new Date(2021, 4, 8, 20, 0),
    },
    {
      id: 3,
      user_id: 1,
      place_id: 1,
      amount: -74,
      date: new Date(2021, 4, 21, 14, 30),
    },
  ],
  places: [
    {
      id: 1,
      name: 'Test place',
      rating: 3,
    },
  ],
};

const dataToDelete = {
  transactions: [1, 2, 3],
  places: [1],
};
