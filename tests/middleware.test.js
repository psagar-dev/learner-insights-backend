const Authorization = require('../middlewares/middleware');

describe('Authorization middleware', () => {
  const jwt = require('jsonwebtoken');

  test('calls next when token valid', async () => {
    const token = 'valid';
    jest.spyOn(jwt, 'verify').mockResolvedValue(true);
    const req = { headers: { authorization: token } };
    const res = { send: jest.fn() };
    const next = jest.fn();
    await Authorization(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test('responds with Invalid Token when missing', async () => {
    const req = { headers: {} };
    const res = { send: jest.fn() };
    const next = jest.fn();
    await Authorization(req, res, next);
    expect(res.send).toHaveBeenCalledWith({ result: 'Invalid Token' });
    expect(next).not.toHaveBeenCalled();
  });
});
