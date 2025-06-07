const { createRes } = require('./testUtils');

describe('Attendance Controller', () => {
  let Attendance;
  let controller;
  beforeEach(() => {
    jest.resetModules();
    Attendance = jest.fn().mockImplementation(() => ({ save: jest.fn().mockResolvedValue({}) }));
    jest.mock('../models/attendance.model', () => Attendance);
    controller = require('../controllers/attendance.controller');
  });

  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  test('attendanceRegister saves all entries', async () => {
    const req = { body: [{ name: 'A' }, { name: 'B' }] };
    const res = createRes();
    await controller.attendanceRegister(req, res);
    // Expect save to be called twice
    expect(Attendance).toHaveBeenCalledTimes(2);
    expect(res.send).toHaveBeenCalledWith({ message: 'Attendance Marked successfully' });
  });
});
