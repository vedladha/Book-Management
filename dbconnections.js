const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config()

const connectDB = async () => {
  try {
    const username = process.env.MONGO_USERNAME
    const password = process.env.MONGO_PASSWORD

    await mongoose.connect(
      `mongodb+srv://${username}:${password}@cluster0.rkjbmjt.mongodb.net/`
    );

    console.log(`MongoDB Connected`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }

  mongoose.connection.on("disconnected", () => {
    console.log("MongoDB disconnected");
  });

  mongoose.connection.on("error", (err) => {
    console.error(`MongoDB connection error: ${err}`);
  });
};

module.exports = connectDB;
