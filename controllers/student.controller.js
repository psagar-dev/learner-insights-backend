const Student = require("../models/student.model");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { log } = require("console");

const hashKey = process.env.HASH_KEY;
const jwtSecretKey = process.env.JWT_SECRET_KEY;

async function Register(req, res) {
  try {
    console.log(req.body);
    let date = new Date();
    req.body.password = crypto
      .createHash("sha256", hashKey)
      .update(req.body.password)
      .digest("hex");

    const existingUser = await Student.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ message: "student already exist" });
    }

    const newStudent = new Student({ ...req.body });
    console.log(newStudent);
    const newSavedStudent = await newStudent.save();
    console.log({ newSavedStudent });
    res.json({ message: "registered" }).status(200);
  } catch (err) {
    res.status(500).json({ message: "not registered", err: err });
  }
}

const StudentLogin = async (req, res) => {
  try {
    console.log(req.body);
    const { email, password } = req.body;

    if (!email || !password) {
      console.log("Please fill all the details");
      return res.send({ message: "Please fill all the details" });
    }

    const result = await Student.findOne({ email });
    if (!result) {
      return res.send("Invalid User");
    }

    const hashedPassword = crypto
      .createHash("sha256", hashKey)
      .update(password)
      .digest("hex");

    if (hashedPassword === result.password) {
      let data = {
        email: req.body.email,
        userType: req.body.userType,
        time: Date(),
        id: result._id,
      };
      const jwtToken = jwt.sign(data, jwtSecretKey, { expiresIn: "12m" });
      let resultpayload = {
        result: result,
        token: jwtToken,
      };
      res.send(resultpayload);
    } else {
      res.status(400).send("Wrong Password");
    }
  } catch (err) {
    res.status(500).json({ message: "Error during login", err: err });
  }
};

module.exports = { Register, StudentLogin };
