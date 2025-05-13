const express = require('express');
const router = express.Router();
const calendarController = require('../controllers/calendar.controller');
const CalendarEvent = require('../models/CalendarEvent');


router.get('/', calendarController.getEventsByUser);


router.delete('/delete-all', async (req, res) => {
  try {
    await CalendarEvent.deleteMany({});
    res.status(200).json({ message: 'Tüm takvim eventleri başarıyla silindi.' });
  } catch (error) {
    console.error('Event silme hatası:', error);
    res.status(500).json({ message: 'Eventler silinirken bir hata oluştu.' });
  }
});

module.exports = router;
