const mongoose = require("mongoose");

const NoteSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  title: { type: String },
  type: { type: String, required: true },
  data: { type: mongoose.Schema.Types.Mixed, required: true },

  isPinned: { type: Boolean, default: false },
  color: { type: Number, required: true },
  date: { type: Date, default: Date.now() },
});

module.exports = mongoose.model("Note", NoteSchema);
