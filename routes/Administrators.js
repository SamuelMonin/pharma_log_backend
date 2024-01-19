const express = require('express');
const router = express.Router();
const administratorsModel = require('../models/Administrators');

router.get('/administrators', async (req, res) => {
    try {
      const administrators = await administratorsModel.find({});
      res.json(administrators);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
});

module.exports = router;