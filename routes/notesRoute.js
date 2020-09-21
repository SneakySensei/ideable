const express = require("express");
const { check, validationResult } = require("express-validator");

const router = express.Router();

const Note = require("../models/Note");

const auth = require("../middleware/auth");

/**
 * @method - GET
 * @description - Get all notes to the current user in a list
 * @param - /list
 */

router.get("/list", auth, async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.user.id });
    res.status(200).json(notes);
  } catch (err) {
    res.status(404).json({ message: "Error in Fetching notes", error: err });
  }
});

router.post("/add", auth, async (req, res) => {
  const { title, type, data, isPinned, color } = req.body;

  note = new Note({
    userId: req.user.id,
    title,
    type,
    data,
    isPinned,
    color,
  });
  try {
    await note.save();

    const notes = await Note.find({ userId: req.user.id });
    res.status(200).json(notes);
  } catch (err) {
    console.log(err.message);
    res
      .status(500)
      .send("Error in Saving Note. If you're server admin, check server log.");
  }
});

router.delete("/:noteId", auth, async (req, res) => {
  try {
    await Note.remove({ _id: req.params.noteId });

    const notes = await Note.find({ userId: req.user.id });
    res.status(200).json(notes);
  } catch (err) {
    res.status(404).json({ message: "Error in deleting note", error: err });
  }
});

router.patch("/:noteId", auth, async (req, res) => {
  const { color, isPinned, title, value } = req.body;
  console.log(req.body);
  try {
    var payload = {};
    if (color !== undefined) payload.color = color;
    if (isPinned !== undefined) payload.isPinned = isPinned;
    if (title !== undefined) payload.title = title;
    if (value !== undefined) payload.data = value;

    await Note.findOneAndUpdate({ _id: req.params.noteId }, payload);

    const notes = await Note.find({ userId: req.user.id });
    res.status(200).json(notes);
  } catch (err) {
    res.status(404).json({ message: "Error in updating note", error: err });
  }
});

module.exports = router;
