const request = require('supertest');
const app = require('../../app');

describe('Auth Controller', () => {
  it('should return 400 for missing credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({});
    expect(res.statusCode).toBe(400);
  });
  // Add more tests for register, OTP, etc.
});
