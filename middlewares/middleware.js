const jwt = require("jsonwebtoken");
const jwtSecretKey = process.env.JWT_SECRET_KEY;

const Authorization = async (req, res, next) => {
  console.log("middleware called");
  const bearerHeader = req.headers.authorization;

  if (!bearerHeader) {
    return res.send({
      result: "Invalid Token"
    });
  }

  try {
    await jwt.verify(bearerHeader, jwtSecretKey);
    next();
  } catch (err) {
    res.send({ result: "Invalid Token" });
  }
};

module.exports = Authorization;