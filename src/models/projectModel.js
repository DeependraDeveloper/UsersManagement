const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const projectSchema = new mongoose.Schema(
  {
    Name: {
      type: String,
      required: true,
      trim: true,
    },
    Description: {
      type: String,
      required: true,
      trim: true,
    },
    userId: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    tasks: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
