const crypto = require('crypto');
const { createRes } = require('./testUtils');

const hashKey = 'testhash';
const jwtSecretKey = 'jwtsecret';

describe('Student Controller', () => {
  let Student;
  let controller;
  beforeEach(() => {
    jest.resetModules();
    process.env.HASH_KEY = hashKey;
    process.env.JWT_SECRET_KEY = jwtSecretKey;

    const saveMock = jest.fn().mockResolvedValue({});
    Student = jest.fn().mockImplementation(() => ({ save: saveMock }));
    Student.findOne = jest.fn();

    jest.mock('../models/student.model', () => Student);
    controller = require('../controllers/student.controller');
  });

  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  test('Register creates student when not existing', async () => {
    Student.findOne.mockResolvedValue(null);
    const req = { body: { email: 'a@b.com', password: 'pass' } };
    const res = createRes();
    await controller.Register(req, res);
    expect(Student.findOne).toHaveBeenCalledWith({ email: 'a@b.com' });
    expect(res.json).toHaveBeenCalledWith({ message: 'registered' });
  });

  test('StudentLogin returns token for valid user', async () => {
    const password = 'pass';
    const hashed = crypto.createHash('sha256', hashKey).update(password).digest('hex');
    Student.findOne.mockResolvedValue({ password: hashed, _id: '1', email: 'a@b.com' });
    const req = { body: { email: 'a@b.com', password, userType: 'student' } };
    const res = createRes();
    await controller.StudentLogin(req, res);
    expect(res.send).toHaveBeenCalled();
    const payload = res.send.mock.calls[0][0];
    expect(payload.result.email).toBe('a@b.com');
    expect(payload.token).toBeDefined();
  });
});
