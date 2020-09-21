const mongoose = require("mongoose");

const NoteSchema = mongoose.Schema({
  date: { type: Date, default: Date.now() },

  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  data: { type: mongoose.Schema.Types.Mixed, required: true },

  color: { type: Number, default: 0 },
  isPinned: { type: Boolean, default: false },
  title: { type: String, default: "" },
  type: { type: String, default: "string" },
});

module.exports = mongoose.model("Note", NoteSchema);
