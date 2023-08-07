const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  organisation: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },

  date: {
    type: Date,
    default: Date.now(),
  },
});

const ChatObject = mongoose.model('Chat', chatSchema);

module.exports = ChatObject;