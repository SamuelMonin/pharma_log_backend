const express = require('express');
const router = express.Router();
const deliveryMenModel = require('../models/DeliveryMen');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const auth = (authorizedProfiles) => (req, res, next) => {
  if (!req.headers.authorization) {
    res.status(401).json({ success: false, message: "Token d'authentification non fourni." });
    return;
  }
  try {
    const token = req.headers.authorization.split(" ")[1];
    const { profil } = jwt.verify(token, 'SAM_S_SECRET');
    if (!authorizedProfiles.includes(profil)) {
      res.status(403).json({ success: false, message: "Votre compte n'a pas la permission pour réaliser cette action." });
      return;
    }
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Token d'authentification invalide." });
  }
};

router.get('/deliveryMen', async (req, res) => {
    try {
      const deliveryMen = await deliveryMenModel.find({});
      res.json(deliveryMen);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
});

router.post('/deliveryMen/delete', auth(['admin']), async (req, res) => {
  try {
    const { id } = req.body;
    const deletedDeliveryMan = await deliveryMenModel.findByIdAndDelete(id);
    if (!deletedDeliveryMan) {
        return res.status(404).json({ error: 'Livreur non trouvé' });
    }
    res.json({ message: 'Livreur supprimé avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.post('/deliveryMen/add', auth(['admin']), async (req, res) => {
  const nameRegex = /^[a-zA-Z]+$/;

  try {
      if (!nameRegex.test(req.body.name)) {
          return res.status(400).json({ message: "Ce nom de famille n'est pas correct." });
      }

      if (!nameRegex.test(req.body.lastname)) {
          return res.status(400).json({ message: "Ce prénom n'est pas correct." });
      }

      const existingDeliveryMan = await deliveryMenModel.findOne({
          name: req.body.name,
          lastname: req.body.lastname,
      });

      if (existingDeliveryMan) {
          return res.status(400).json({ message: "Ce livreur existe déjà." });
      }

      const newDeliveryMan = new deliveryMenModel({
          name: req.body.name,
          lastname: req.body.lastname,
      });

      await newDeliveryMan.save();

      res.status(200).json({ message: "Le livreur a été ajouté avec succès." });

  } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Une erreur s'est produite lors de l'ajout du livreur." });
  }
});

router.put('/deliveryMen/update', auth(['admin']), async (req, res) => {

  const nameRegex = /^[a-zA-Z]+$/;

  try {
    if (!nameRegex.test(req.body.name)) {
      return res.status(400).json({ message: "Le nom n'est pas correct." });
    }

    if (!nameRegex.test(req.body.lastname)) {
      return res.status(400).json({ message: "Le prénom n'est pas correct." });
    }

    const existingDeliveryMan = await deliveryMenModel.findOne({
      name: req.body.name,
      lastname: req.body.lastname,
    });

    if (existingDeliveryMan) {
      return res.status(400).json({ message: "Ce livreur n'a pas été modifié." });
    }

    const updatedDeliveryMan = await deliveryMenModel.findByIdAndUpdate(req.body.id, {
      name: req.body.name,
      lastname: req.body.lastname
    }, { new: true });

    if (!updatedDeliveryMan) {
      return res.status(400).json({ message: "Livreur non trouvé." });
    }

    res.status(200).json({ message: "Livreur mis à jour avec succès.", updatedDeliveryMan });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur lors de la mise à jour du livreur." });
  }
});

module.exports = router;