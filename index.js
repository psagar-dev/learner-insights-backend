const express = require("express");
const app = express();
const port = process.env.PORT || 3001;
const connect = require("./database/mongoDb");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
// require("dotenv").config({ path: "config.env" });

const studentRoutes = require("./routes/student.routes");
const adminRoutes = require("./routes/admin.routes");
const careerServiceRoutes = require("./routes/careerService.routes");
const facultyRoute = require("./routes/facultyRoute");
const questionUploadRoute =  require("./routes/questionUpload.routes");
const batchRegisterRoute = require("./routes/batchRegister.route")
const getBatchRoute = require("./routes/common.route");
const attendanceRoute = require("./routes/attendance.routes")
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

app.use("/student", studentRoutes);
app.use("/admin", adminRoutes);
app.use("/careerService", careerServiceRoutes);
app.use("/faculty", facultyRoute);
app.use("/", getBatchRoute);
app.use("/", questionUploadRoute)
app.use("/batch" , batchRegisterRoute)
app.use("/attendance" , attendanceRoute)

// app.use("/users",);

const dashBoardInfo = [
  { name: "Batches", value: "12", color: "rgb(209, 233, 252)" },
  { name: "Total Learners", value: "120", color: "rgb(208, 242, 255)" },
  { name: "Active learners", value: "76", color: "rgb(255, 247, 205)" },
  { name: "Learner Reports", value: "available", color: "rgb(255, 231, 217)" },
];

const StudentBoardInfo = [
  {
    id: 1,
    name: "Snehal",
    batch: "FSD2",
    avatar: "images_student",
    enrolled: "12-10-22",
    course_name: "Full Stack Development Program",
    color: "rgb(209, 233, 252)",
  },
];

app.get('/api/dashboard', (req, res) => {
  res.status(200).json(dashBoardInfo);
});

app.get('/api/studentinfo', (req, res) => {
  res.status(200).json(StudentBoardInfo);
});

app.get("/", (req, res) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.send("Okay");
});

const startServer = async () => {
  try {
    await connect();
    app.listen(port, () => {
      console.log(`Example app listening at http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
