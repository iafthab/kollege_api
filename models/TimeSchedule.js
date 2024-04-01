const mongoose = require("mongoose");

// Schema for a day
const daySchema = new mongoose.Schema({
  monday: [
    {
      type: String,
      required: true,
      default: [],
    },
  ],
  tuesday: [
    {
      type: String,
      required: true,
      default: [],
    },
  ],
  wednesday: [
    {
      type: String,
      required: true,
      default: [],
    },
  ],
  thursday: [
    {
      type: String,
      required: true,
      default: [],
    },
  ],
  friday: [
    {
      type: String,
      required: true,
      default: [],
    },
  ],
});

// Time Schedule of the Staff
const timeScheduleSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  schedule: daySchema,
});

module.exports = mongoose.model("Time_Schedule", timeScheduleSchema);
