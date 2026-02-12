require('dotenv').config();

const request = require('supertest');
const app = require('../src/app'); // your Express app

describe('User API', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({ username: 'timothy', password: 'secret' });
    expect(res.statusCode).toBe(201);
    expect(res.body.username).toBe('timothy');
  });

  it('should login and return a JWT', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({ username: 'timothy', password: 'secret' });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});
