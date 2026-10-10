
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully!");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error.message);
  });

// Define the structure of user details
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
});

// Create a model
const User = mongoose.model("User", userSchema);

// Receive details and save them
app.post("/api/users", async (req, res) => {
  try {
    const { name, dateOfBirth } = req.body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      !dateOfBirth ||
      Number.isNaN(Date.parse(dateOfBirth))
    ) {
      return res.status(400).json({
        message: "Please enter a valid name and date of birth.",
      });
    }

    const user = await User.create({
      name: name.trim(),
      dateOfBirth,
    });

    res.status(201).json({
      message: "User details saved successfully!",
      user: {
        id: user._id,
        name: user.name,
        dateOfBirth: dateOfBirth,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to save user details.",
    });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
