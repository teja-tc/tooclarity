const Branch = require('../../models/Branch');

describe('Branch Model', () => {
  it('should create a branch instance', () => {
    const branch = new Branch({ name: 'Test Branch' });
    expect(branch).toHaveProperty('name', 'Test Branch');
  });
});
