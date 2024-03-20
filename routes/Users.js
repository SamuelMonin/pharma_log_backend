const express = require('express');
const router = express.Router();
const usersModel = require('../models/Users');
const crypto = require('crypto');

router.get('/users', async (req, res) => {
    try {
      const users = await usersModel.find({});
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
});

router.post('/users/delete', async (req, res) => {
  try {
    const { id } = req.body;
    const deletedUser = await usersModel.findByIdAndDelete(id);
    if (!deletedUser) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    res.json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.post('/users/add', async (req, res) => {

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  try {

      if (!emailRegex.test(req.body.mail)) {
          return res.status(200).json({ success: false, message: "Le mail n'est pas aux bon format (Ex: john.doe@gmail.com)." });
      }

      const hashedPassword = crypto.createHash('sha256').update(req.body.password).digest('hex');

      const existingUser = await usersModel.findOne({
        login: req.body.login,
        password: hashedPassword,
        mail: req.body.mail
      });

      if (existingUser) {
          return res.status(200).json({ success: false, message: "Cet user existe déjà." });
      }

      const newUser = new usersModel({
        login: req.body.login,
        password: hashedPassword,
        mail: req.body.mail
      });

      await newUser.save();

      res.status(200).json({ success: true, message: "Cet user a été ajouté avec succès." });

  } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Une erreur s'est produite lors de l'ajout du user." });
  }
});

router.put('/users/update', async (req, res) => {

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  try {
        
    if (!emailRegex.test(req.body.mail)) {
      return res.status(200).json({ success: false, message: "Le mail n'est pas aux bon format (Ex: john.doe@gmail.com)." });
    }

    const hashedPassword = crypto.createHash('sha256').update(req.body.password).digest('hex');

    if (req.body.password.length === 0) {

      const existingUser = await usersModel.findOne({
        login: req.body.login,
        mail: req.body.mail
      });
  
      if (existingUser) {
          return res.status(200).json({ success: false, message: "Cet user n'a pas été modifié." });
      }

      await usersModel.findByIdAndUpdate(req.body.id, {
        login: req.body.login,
        mail: req.body.mail
      }, { new: true });
      res.status(200).json({ success: true, message: "L'user a été mis à jour avec succès." });

    } else {

      const updatedUser = await usersModel.findByIdAndUpdate(req.body.id, {
        login: req.body.login,
        password: hashedPassword,
        mail: req.body.mail
      }, { new: true });
  
      if (!updatedUser) {
        return res.status(200).json({ success: false, message: "User non trouvé." });
      }
  
      res.status(200).json({ success: true, message: "L'user a été mis à jour avec succès." });
      
    }

    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: "Erreur serveur lors de la mise à jour du user." });
    }
});

module.exports = router;