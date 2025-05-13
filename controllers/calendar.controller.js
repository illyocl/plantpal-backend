const CalendarEvent = require('../models/CalendarEvent');


exports.getEventsByUser = async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: 'Kullanıcı ID gerekli.' });
  }

  try {
    const events = await CalendarEvent.find({ userId }).sort({ date: 1 });
    res.status(200).json(events);
  } catch (error) {
    console.error('Takvim eventi listeleme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};
