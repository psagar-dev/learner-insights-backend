const AttendanceModel = require("../models/attendance.model");

const attendanceRegister = async (req, res) => {
  try {
    const att = req.body;
    for (const element of att) {
      const newAttendance = new AttendanceModel(element);
      await newAttendance.save();
    }
    
    res.send({ message: "Attendance Marked successfully" });
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports = { attendanceRegister };