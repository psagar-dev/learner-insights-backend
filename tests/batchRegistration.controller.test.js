const { createRes } = require('./testUtils');

describe('BatchRegistration Controller', () => {
  let Batch;
  let controller;
  beforeEach(() => {
    jest.resetModules();
    Batch = jest.fn().mockImplementation(() => ({ save: jest.fn().mockResolvedValue({}) }));
    Batch.findOne = jest.fn();
    jest.mock('../models/batchRegistration.model', () => Batch);
    controller = require('../controllers/batchRegistration.controller');
  });

  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  test('batchRegister saves new batch', async () => {
    Batch.findOne.mockResolvedValue(null);
    const req = { body: { BatchName: 'B1' } };
    const res = createRes();
    await controller.batchRegister(req, res);
    expect(Batch.findOne).toHaveBeenCalledWith({ BatchName: 'B1' });
    expect(res.send).toHaveBeenCalledWith({ message: 'Batch created successfully' });
  });
});
