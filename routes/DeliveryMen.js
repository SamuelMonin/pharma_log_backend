const express = require('express');
const router = express.Router();
const deliveryMenModel = require('../models/DeliveryMen');

router.get('/deliveryMen', async (req, res) => {
    try {
      const deliveryMen = await deliveryMenModel.find({});
      res.json(deliveryMen);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
});

router.delete('/deliveryMen/delete', async (req, res) => {
  try {
      const deletedDeliveryMan = await deliveryMenModel.findByIdAndDelete(req.params.id);
      if (!deletedDeliveryMan) {
          return res.status(404).json({ error: 'Livreur non trouvé' });
      }
      res.json({ message: 'Livreur supprimé avec succès' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;