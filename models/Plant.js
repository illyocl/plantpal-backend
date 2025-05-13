const mongoose = require('mongoose');

const plantSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  size: { type: String, required: true },
  dateAdded: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Plant', plantSchema);
