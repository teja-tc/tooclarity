const { verifyToken } = require('../../middleware/auth.middleware');

describe('Auth Middleware', () => {
  it('should throw error if no token', () => {
    const req = { headers: {} };
    const res = {};
    expect(() => verifyToken(req, res, () => {})).toThrow();
  });
});
