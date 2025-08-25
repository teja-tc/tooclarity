const otpService = require('../../services/otp.service');

describe('OTP Service', () => {
  it('should generate a numeric OTP', () => {
    const otp = otpService.generateOTP();
    expect(typeof otp).toBe('string');
    expect(otp).toMatch(/^[0-9]+$/);
  });
});
