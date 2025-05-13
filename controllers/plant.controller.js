const Plant = require('../models/Plant');
const CalendarEvent = require('../models/CalendarEvent');


exports.addPlant = async (req, res) => {
  const { userId } = req.query;
  const { name, type, size } = req.body;

  if (!userId || !name || !type || !size) {
    return res.status(400).json({ message: 'Eksik bilgi gönderildi.' });
  }

  try {
    
    const plant = new Plant({
      userId,
      name,
      type,
      size,
    });

    const savedPlant = await plant.save();

   
    await createDefaultEvents(savedPlant);

    res.status(201).json({ message: 'Bitki ve takvim eventleri başarıyla eklendi.', plant: savedPlant });
  } catch (error) {
    console.error('Bitki ekleme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};


exports.getPlants = async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ message: 'Kullanıcı ID gerekli.' });
  }

  try {
    const plants = await Plant.find({ userId });
    res.status(200).json(plants);
  } catch (error) {
    console.error('Bitki listeleme hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};


exports.deletePlant = async (req, res) => {
  const { plantId } = req.params;

  try {
    
    await Plant.findByIdAndDelete(plantId);

    
    await CalendarEvent.deleteMany({ plantId });

    res.status(200).json({ message: 'Bitki ve ilişkili eventler başarıyla silindi.' });
  } catch (error) {
    console.error('Bitki silme hatası:', error);
    res.status(500).json({ message: 'Bitki veya eventler silinemedi.' });
  }
};


async function createDefaultEvents(plant) {
  const events = [];
  const today = new Date();


  let wateringFrequency;
  switch (plant.size) {
    case 'küçük':
      wateringFrequency = 7;
      break;
    case 'orta':
      wateringFrequency = 3;
      break;
    case 'büyük':
      wateringFrequency = 2;
      break;
    default:
      wateringFrequency = 7;
  }

  
  for (let i = 1; i <= 12; i++) {
    events.push({
      plantId: plant._id,
      userId: plant.userId,
      plantName: plant.name,
      title: 'Sulama',
      date: new Date(today.getTime() + i * wateringFrequency * 24 * 60 * 60 * 1000),
      size: plant.size,
    });
  }

 
  for (let i = 1; i <= 6; i++) {
    const nextMonth = new Date(today);
    nextMonth.setMonth(nextMonth.getMonth() + i);
    nextMonth.setDate(nextMonth.getDate() + 15);
    events.push({
      plantId: plant._id,
      userId: plant.userId,
      plantName: plant.name,
      title: 'Gübreleme',
      date: nextMonth,
      size: plant.size,
    });
  }

  for (let i = 1; i <= 12; i++) {
    const nextMonthStart = new Date(today);
    nextMonthStart.setMonth(nextMonthStart.getMonth() + i);
    nextMonthStart.setDate(1);
    events.push({
      plantId: plant._id,
      userId: plant.userId,
      plantName: plant.name,
      title: 'Toprak Değişimi',
      date: nextMonthStart,
      size: plant.size,
    });
  }


  await CalendarEvent.insertMany(events);
}
