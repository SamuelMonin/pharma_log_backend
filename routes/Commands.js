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

router.post('/commands/delete', async (req, res) => {
  try {
    const { id } = req.body;
    const deletedCommand = await commandsModel.findByIdAndDelete(id);
    if (!deletedCommand) {
        return res.status(404).json({ error: 'Commande non trouvé' });
    }
    res.json({ message: 'Commande supprimé avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;