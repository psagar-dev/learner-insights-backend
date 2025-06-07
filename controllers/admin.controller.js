const Admin = require("../models/admin.model");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const hashKey = process.env.HASH_KEY;
const jwtSecretKey = process.env.JWT_SECRET_KEY;

async function adminRegister(req, res) {
  const {email, password}  = req.body
  console.log(req.body);
  let date = new Date();
  req.body.password = crypto
    .createHash("sha256", hashKey)
    .update(req.body.password)
    .digest("hex");

  try {
    const user = await Admin.findOne({ email: email });
    if (user) {
      return res.send({ message: "admin already exist" });
    }
    
    const newAdmin = new Admin({ ...req.body });
    console.log(newAdmin);
    const newSavedAdmin = await newAdmin.save();
    console.log({ newSavedAdmin });
    res.json({ message: "registered" }).status(200);
  } catch (err) {
    res.status(500).json({ message: "not registered", err: err });
  }
}

const AdminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      console.log("Please fill all the details");
      return res.json({ message: "Please fill all the details", login: false });
    }

    const result = await Admin.findOne({ email: email });
    if (!result) {
      return res.send("Invalid User");
    }

    const hashedPassword = crypto
      .createHash("sha256", hashKey)
      .update(password)
      .digest("hex");

    if (hashedPassword === result.password) {
      // Create JWT token
      let data = {
        email: req.body.email,
        userType: req.body.userType,
      };
      const jwtToken = jwt.sign(data, jwtSecretKey, { expiresIn: "12m" });
      let resultpayload = {
        result: result,
        token: jwtToken,
      };
      console.log("resultpayload", resultpayload);
      res.send(resultpayload);
    } else {
      res.status(400).send("Wrong Password");
    }
  } catch (err) {
    res.status(500).json({ message: "Error during login", err: err });
  }
};

module.exports = { adminRegister, AdminLogin };
