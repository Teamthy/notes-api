require('dotenv').config();

const request = require('supertest');
const app = require('../src/app');

describe('Notes API', () => {
  it('should return notes array', async () => {
    const res = await request(app).get('/api/notes');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
