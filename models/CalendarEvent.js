const mongoose = require('mongoose');

const calendarEventSchema = new mongoose.Schema({
  plantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Plant', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  plantName: { type: String, required: true }, 
  title: { type: String, required: true },
  date: { type: Date, required: true },
  size: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('CalendarEvent', calendarEventSchema);
