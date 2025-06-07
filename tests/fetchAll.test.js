const { createRes } = require('./testUtils');

describe('Common fetchAll', () => {
  let Student;
  let Batch;
  let controller;
  beforeEach(() => {
    jest.resetModules();
    Student = { find: jest.fn() };
    Batch = { find: jest.fn() };
    jest.mock('../models/student.model', () => Student);
    jest.mock('../models/batchRegistration.model', () => Batch);
    controller = require('../controllers/common/fetchAll');
  });

  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  test('getAllStudent returns all students', async () => {
    Student.find.mockResolvedValue(['s']);
    const res = createRes();
    await controller.getAllStudent({}, res);
    expect(res.send).toHaveBeenCalledWith(['s']);
  });

  test('getBatchStudent filters by batch', async () => {
    Student.find.mockResolvedValue(['s1']);
    const req = { body: { batchName: 'B1' } };
    const res = createRes();
    await controller.getBatchStudent(req, res);
    expect(Student.find).toHaveBeenCalledWith({ batchName: 'B1' });
    expect(res.send).toHaveBeenCalledWith(['s1']);
  });

  test('getAllBatch returns all batches', async () => {
    Batch.find.mockResolvedValue(['b']);
    const res = createRes();
    await controller.getAllBatch({}, res);
    expect(res.send).toHaveBeenCalledWith(['b']);
  });
});
