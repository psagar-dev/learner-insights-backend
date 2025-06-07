const { createRes } = require('./testUtils');

jest.mock('../models/questionUpload.model', () => jest.fn());

describe('QuestionUpload Controller', () => {
  let Questions;
  let controller;
  beforeEach(() => {
    jest.resetModules();
    Questions = require('../models/questionUpload.model');
    Questions.mockImplementation(() => ({ save: jest.fn().mockResolvedValue({}) }));
    Questions.findOne = jest.fn();
    Questions.find = jest.fn();
    controller = require('../controllers/questionUpload.controller');
  });

  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  test('addQuestion saves new question', async () => {
    Questions.findOne.mockResolvedValue(null);
    const req = { body: { question: 'q', question_title: 't', total_marks: 1, skill_tag: 's', sub_tag: 'st', tag_level: 'l' } };
    const res = createRes();
    await controller.addQuestion(req, res);
    expect(Questions.findOne).toHaveBeenCalledWith({ question_title: 't' });
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test('getAllQuestions returns list', async () => {
    Questions.find.mockResolvedValue([{}]);
    const req = {};
    const res = createRes();
    await controller.getAllQuestions(req, res);
    expect(res.send).toHaveBeenCalledWith([{}]);
  });
});
