const request = require('supertest');
const app = require('../../app');

describe('Auth Routes', () => {
  it('should 404 on unknown route', async () => {
    const res = await request(app).get('/api/auth/unknown');
    expect(res.statusCode).toBe(404);
  });
});
