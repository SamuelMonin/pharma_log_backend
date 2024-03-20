const express = require('express');
const router = express.Router();
const deliveryMenModel = require('../models/DeliveryMen');
const mongoose = require('mongoose');

router.get('/deliveryMen', async (req, res) => {
    try {
      const deliveryMen = await deliveryMenModel.find({});
      res.json(deliveryMen);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
});

router.post('/deliveryMen/delete', async (req, res) => {
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

router.post('/deliveryMen/add', async (req, res) => {
  const nameRegex = /^[a-zA-Z]+$/;

  try {
      if (!nameRegex.test(req.body.name)) {
          return res.status(200).json({ success: false, message: "Ce nom de famille n'est pas correct." });
      }

      if (!nameRegex.test(req.body.lastname)) {
          return res.status(200).json({ success: false, message: "Ce prénom n'est pas correct." });
      }

      const existingDeliveryMan = await deliveryMenModel.findOne({
          name: req.body.name,
          lastname: req.body.lastname,
      });

      if (existingDeliveryMan) {
          return res.status(200).json({ success: false, message: "Ce livreur existe déjà." });
      }

      const newDeliveryMan = new deliveryMenModel({
          name: req.body.name,
          lastname: req.body.lastname,
      });

      await newDeliveryMan.save();

      res.status(200).json({ success: true, message: "Le livreur a été ajouté avec succès." });

  } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Une erreur s'est produite lors de l'ajout du livreur." });
  }
});

router.put('/deliveryMen/update', async (req, res) => {

  const nameRegex = /^[a-zA-Z]+$/;

  try {
    if (!nameRegex.test(req.body.name)) {
      return res.status(400).json({ success: false, message: "Le nom n'est pas correct." });
    }

    if (!nameRegex.test(req.body.lastname)) {
      return res.status(400).json({ success: false, message: "Le prénom n'est pas correct." });
    }

    const updatedDeliveryMan = await deliveryMenModel.findByIdAndUpdate(req.body.id, {
      name: req.body.name,
      lastname: req.body.lastname
    }, { new: true });

    if (!updatedDeliveryMan) {
      return res.status(200).json({ success: false, message: "Livreur non trouvé." });
    }

    const existingDeliveryMan = await deliveryMenModel.findOne({
      name: req.body.name,
      lastname: req.body.lastname,
    });

    if (existingDeliveryMan) {
      return res.status(200).json({ success: false, message: "Ce livreur n'a pas été modifié." });
    }

    res.status(200).json({ success: true, message: "Livreur mis à jour avec succès.", updatedDeliveryMan });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Erreur serveur lors de la mise à jour du livreur." });
  }
});

module.exports = router;