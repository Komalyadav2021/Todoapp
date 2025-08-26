const mongoose = require("mongoose");

const TodoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  due_date: {
    type: Date, 
    required: true 
  },
  created_at: { 
    type: Date, 
    default: Date.now 
  },
  completed: { 
    type: Boolean, 
    default: false 
  },
});

module.exports = mongoose.model("Todo", TodoSchema);
