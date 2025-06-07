const Batch = require("../models/batchRegistration.model");

const batchRegister = async (req, res) => {
  try {
    const BatchName = req.body.BatchName;
    const existingBatch = await Batch.findOne({ BatchName });

    if (existingBatch) {
      return res.send({ message: "Batch already exist" });
    }

    const newBatch = new Batch({ ...req.body });
    await newBatch.save();
    res.send({ message: "Batch created successfully" });
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports = { batchRegister };
