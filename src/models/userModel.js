const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    Name: {
      type: String,
      required: true,
      trim: true,
    },
    company_Name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    ph_Number: {
      type: Number,
      required: true,
      unique: true,
      trim: true,
    },
    email_Id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
