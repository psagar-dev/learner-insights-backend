const crypto = require('crypto');
const { createRes } = require('./testUtils');

jest.mock('../models/admin.model', () => jest.fn());

const hashKey = 'hash';
const jwtSecretKey = 'secret';

describe('Admin Controller', () => {
  let Admin;
  let controller;
  beforeEach(() => {
    jest.resetModules();
    process.env.HASH_KEY = hashKey;
    process.env.JWT_SECRET_KEY = jwtSecretKey;
    const saveMock = jest.fn().mockResolvedValue({});
    Admin = require('../models/admin.model');
    Admin.mockImplementation(() => ({ save: saveMock }));
    Admin.findOne = jest.fn();
    controller = require('../controllers/admin.controller');
  });

  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  test('adminRegister creates admin when not existing', async () => {
    Admin.findOne.mockResolvedValue(null);
    const req = { body: { email: 'a@b.com', password: 'pass' } };
    const res = createRes();
    await controller.adminRegister(req, res);
    expect(Admin.findOne).toHaveBeenCalledWith({ email: 'a@b.com' });
    expect(res.json).toHaveBeenCalledWith({ message: 'registered' });
  });

  test('AdminLogin success', async () => {
    const password = 'pass';
    const hashed = crypto.createHash('sha256', hashKey).update(password).digest('hex');
    Admin.findOne.mockResolvedValue({ password: hashed, email: 'a@b.com' });
    const req = { body: { email: 'a@b.com', password, userType: 'admin' } };
    const res = createRes();
    await controller.AdminLogin(req, res);
    expect(res.send).toHaveBeenCalled();
  });
});
