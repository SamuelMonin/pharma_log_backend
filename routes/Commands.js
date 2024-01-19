const express = require('express');
const router = express.Router();
const commandsModel = require('../models/Commands');

router.get('/commands', async (req, res) => {
    try {
      const commands = await commandsModel.find({});
      res.json(commands);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
});

module.exports = router;