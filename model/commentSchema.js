const mongoose = require("mongoose");
const Members = require("./memberSchema");
const Watches = require("./watchSchema");
// Định nghĩa commentSchema
const commentSchema = new mongoose.Schema({
  rating: {
    type: Number,
    min: 1,
    max: 3,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Members",
    required: true,
  },
  watch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Watches",
    required: true,
  },
});

module.exports = mongoose.model("Comment", commentSchema);
