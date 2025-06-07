const { careerService } = require("../models/careerService.model");
const crypto = require("crypto");
const hashKey = process.env.HASH_KEY;
const jwt = require("jsonwebtoken");
const jwtSecretKey = process.env.JWT_SECRET_KEY;

const careerServiceRegister = async (req, res) => {
  try {
    console.log(req.body);
    req.body.password = crypto
      .createHash("sha256", hashKey)
      .update(req.body.password)
      .digest("hex");

    const { email } = req.body;
    const existingUser = await careerService.findOne({ email });

    if (existingUser) {
      return res.send({ message: "user already exist" });
    }

    const user = new careerService({ ...req.body });
    await user.save();
    res.send({ message: "User created successfully" });
  } catch (err) {
    res.status(500).send(err);
  }
};

const careerServiceLogin = async (req, res) => {
  try {
    console.log(req.body);
    const { email, password } = req.body;

    if (!email && !password) {
      console.log("Please fill all the details");
      return res.send({ message: "Please fill all the details" });
    }

    const result = await careerService.findOne({ email });
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
      };
      const jwtToken = jwt.sign(data, jwtSecretKey, { expiresIn: "2m" });
      let resultpayload = {
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

const getAllCareerServices = async (req, res) => {
  try {
    const result = await careerService.find({});
    console.log(result);
    res.json({ result });
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports = {
  careerServiceRegister,
  careerServiceLogin,
  getAllCareerServices,
};
