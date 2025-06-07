const { createRes } = require('./testUtils');

jest.mock('../models/attendance.model', () => jest.fn());

describe('Attendance Controller', () => {
  let Attendance;
  let controller;
  beforeEach(() => {
    jest.resetModules();
    Attendance = require('../models/attendance.model');
    Attendance.mockImplementation(() => ({ save: jest.fn().mockResolvedValue({}) }));
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
