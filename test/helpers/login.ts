import type supertest from 'supertest';

export const login = async (supertest: supertest.Agent): Promise<string> => {
  const response = await supertest.post('/auth/login').send({
    email: 'test.user@hogent.be',
    password: '12345678',
  });

   if (!response.body.token) {
    throw new Error('No token received');
  }

  return response.body.token;
};

export const loginAdmin = async (supertest: supertest.Agent): Promise<string> => {
  const response = await supertest.post('/auth/login').send({
    email: 'admin.user@hogent.be',
    password: '12345678',
  });

  if (!response.body.token) {
    throw new Error(response.body.message || 'Unknown error occured');
  }

   return response.body.token;
};
