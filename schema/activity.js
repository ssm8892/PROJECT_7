"use strict";

const mongoose = require("mongoose");

/**
 * Define the Mongoose Schema for an Activity.
 */
const activitySchema = new mongoose.Schema({
  type: String,
  date: Date,
  user_id: mongoose.Schema.Types.ObjectId,
  photo_id: mongoose.Schema.Types.ObjectId,
});

/**
 * Create a Mongoose Model for an Activity using the activitySchema.
 */
const Activity = mongoose.model("Activity", activitySchema);

/**
 * Make this available to our application.
 */
module.exports = Activity;