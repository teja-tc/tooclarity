const AppError = require('../../utils/AppError');

describe('AppError Util', () => {
  it('should create an error with message and status', () => {
    const err = new AppError('Test error', 400);
    expect(err.message).toBe('Test error');
    expect(err.statusCode).toBe(400);
  });
});
