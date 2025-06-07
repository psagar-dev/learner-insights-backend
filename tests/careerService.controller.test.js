const crypto = require('crypto');
const { createRes } = require('./testUtils');

jest.mock('../models/careerService.model', () => ({ careerService: jest.fn() }));

const hashKey = 'hash';
const jwtSecretKey = 'secret';

describe('CareerService Controller', () => {
  let careerService;
  let controller;
  beforeEach(() => {
    jest.resetModules();
    process.env.HASH_KEY = hashKey;
    process.env.JWT_SECRET_KEY = jwtSecretKey;
    const saveMock = jest.fn().mockResolvedValue({});
    ({ careerService } = require('../models/careerService.model'));
    careerService.mockImplementation(() => ({ save: saveMock }));
    careerService.findOne = jest.fn();
    careerService.find = jest.fn();
    controller = require('../controllers/careerService.controller');
  });

  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  test('careerServiceRegister creates user when not exist', async () => {
    careerService.findOne.mockResolvedValue(null);
    const req = { body: { email: 'a@b.com', password: 'pass' } };
    const res = createRes();
    await controller.careerServiceRegister(req, res);
    expect(careerService.findOne).toHaveBeenCalledWith({ email: 'a@b.com' });
    expect(res.send).toHaveBeenCalledWith({ message: 'User created successfully' });
  });

  test('careerServiceLogin returns token', async () => {
    const password = 'pass';
    const hashed = crypto.createHash('sha256', hashKey).update(password).digest('hex');
    careerService.findOne.mockResolvedValue({ password: hashed, email: 'a@b.com' });
    const req = { body: { email: 'a@b.com', password, userType: 'cs' } };
    const res = createRes();
    await controller.careerServiceLogin(req, res);
    expect(res.send).toHaveBeenCalled();
  });

  test('getAllCareerServices returns result', async () => {
    careerService.find.mockResolvedValue([{}]);
    const req = {};
    const res = createRes();
    await controller.getAllCareerServices(req, res);
    expect(res.json).toHaveBeenCalledWith({ result: [{}] });
  });
});
