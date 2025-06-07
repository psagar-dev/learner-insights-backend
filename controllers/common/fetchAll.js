const Student = require("../../models/student.model");
const Batch = require("../../models/batchRegistration.model");

const getAllStudent = async (req, res) => {
  try {
    const result = await Student.find({});
    console.log(result);
    res.send(result);
  } catch (err) {
    res.status(500).send(err);
  }
};

const getBatchStudent = async (req, res) => {
  try {
    const batchName = req.body.batchName;
    console.log("batchName", batchName);
    const result = await Student.find({ batchName });
    res.send(result);
  } catch (err) {
    res.status(500).send(err);
  }
};

const getAllBatch = async (req, res) => {
  try {
    const result = await Batch.find({});
    console.log(result);
    res.send(result);
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports = { getAllStudent, getBatchStudent, getAllBatch };