const facultyLogin = require('../models/faculty.model');
const crypto = require("crypto");
const hashKey = process.env.HASH_KEY;
const jwt = require("jsonwebtoken");
const jwtSecretKey = process.env.JWT_SECRET_KEY;

const facultyRegister = async (req, res) => {
  try {
    req.body.password = crypto
      .createHash("sha256", hashKey)
      .update(req.body.password)
      .digest("hex");

    const { email } = req.body;
    const existingUser = await facultyLogin.findOne({ email });

    if (existingUser) {
      return res.send({ message: "user already exist" });
    }

    const user = new facultyLogin({ ...req.body });
    await user.save();
    res.send({ message: "sucessfull" });
  } catch (err) {
    res.status(500).send(err);
  }
};

const facultyLoginMethod = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.send({ message: "Please fill all the details" });
    }

    const result = await facultyLogin.findOne({ email });
    if (!result) {
      return res.status(400).send("Invalid User");
    }

    const hashedPassword = crypto
      .createHash("sha256", hashKey)
      .update(password)
      .digest("hex");

    if (hashedPassword === result.password) {
      let data = {
        email: req.body.email,
        userType: req.body.userType,
      };
      const jwtToken = jwt.sign(data, jwtSecretKey, { expiresIn: '2m' });
      const resultpayload = {
        result: result,
        token: jwtToken,
      };
      return res.send(resultpayload);
    } else {
      return res.status(400).send("Wrong Password");
    }
  } catch (err) {
    res.status(500).send(err);
  }
};

const getAllFaculty = async (req, res) => {
  try {
    const result = await facultyLogin.find({});
    res.json({ result });
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports = { facultyRegister, facultyLoginMethod, getAllFaculty };