const express = require('express');
const router = express.Router();
const plantController = require('../controllers/plant.controller');


router.post('/', plantController.addPlant);


router.get('/', plantController.getPlants);


router.delete('/:plantId', plantController.deletePlant);

module.exports = router;
