const Questions = require("../models/questionUpload.model");

const addQuestion = async (req, res) => {
  try {
    const question_title = req.body.question_title;
    const existingQuestion = await Questions.findOne({ question_title });

    if (existingQuestion) {
      return res.status(400).json({ message: "Question already exist" });
    }

    if (!req.body.question ||
        !req.body.total_marks ||
        !req.body.skill_tag ||
        !req.body.sub_tag ||
        !req.body.tag_level) {
      return res.json({ message: "Please fill all the details", data: req.body });
    }

    const newQuestion = new Questions(req.body);
    await newQuestion.save();
    res.status(200).json({ message: "question uploaded successfully", status: "done" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllQuestions = async (req, res) => {
  try {
    const result = await Questions.find({});
    res.send(result);
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports = { addQuestion, getAllQuestions };
