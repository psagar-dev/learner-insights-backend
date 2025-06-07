const crypto = require('crypto');
const { createRes } = require('./testUtils');

const hashKey = 'hash';
const jwtSecretKey = 'secret';

describe('Faculty Controller', () => {
  let faculty;
  let controller;
  beforeEach(() => {
    jest.resetModules();
    process.env.HASH_KEY = hashKey;
    process.env.JWT_SECRET_KEY = jwtSecretKey;
    const saveMock = jest.fn().mockResolvedValue({});
    faculty = jest.fn().mockImplementation(() => ({ save: saveMock }));
    faculty.findOne = jest.fn();
    faculty.find = jest.fn();
    jest.mock('../models/faculty.model', () => faculty);
    controller = require('../controllers/facultyController');
  });

  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  test('facultyRegister success', async () => {
    faculty.findOne.mockResolvedValue(null);
    const req = { body: { email: 'a@b.com', password: 'pass' } };
    const res = createRes();
    await controller.facultyRegister(req, res);
    expect(faculty.findOne).toHaveBeenCalledWith({ email: 'a@b.com' });
    expect(res.send).toHaveBeenCalledWith({ message: 'sucessfull' });
  });

  test('facultyLoginMethod returns token', async () => {
    const password = 'pass';
    const hashed = crypto.createHash('sha256', hashKey).update(password).digest('hex');
    faculty.findOne.mockResolvedValue({ password: hashed, email: 'a@b.com' });
    const req = { body: { email: 'a@b.com', password, userType: 'faculty' } };
    const res = createRes();
    await controller.facultyLoginMethod(req, res);
    expect(res.send).toHaveBeenCalled();
  });

  test('getAllFaculty', async () => {
    faculty.find.mockResolvedValue([{}]);
    const req = {};
    const res = createRes();
    await controller.getAllFaculty(req, res);
    expect(res.json).toHaveBeenCalledWith({ result: [{}] });
  });
});
