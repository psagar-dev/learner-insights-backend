const mongoose = require("mongoose");

const connect = async () => {
  try {
    const connectionString = process.env.ATLAS_URI;
    
    // Validate connection string
    if (!connectionString) {
      throw new Error("MongoDB connection string (ATLAS_URI) is not defined in environment variables");
    }
    
    if (!connectionString.startsWith("mongodb://") && !connectionString.startsWith("mongodb+srv://")) {
      throw new Error("Invalid MongoDB connection string. It must start with 'mongodb://' or 'mongodb+srv://'");
    }

    await mongoose.connect(connectionString);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    throw err; // Re-throw the error to be handled by the caller
  }
};

module.exports = connect;
