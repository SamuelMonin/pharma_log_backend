const express = require('express');
const router = express.Router();
const usersModel = require('../models/Users');
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

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.get('/users', async (req, res) => {
    try {
      const users = await usersModel.find({});
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
});

router.post('/users/delete', auth(['admin']), async (req, res) => {
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

router.post('/users/add', auth(['admin']), async (req, res) => {
  try {
      if (!emailRegex.test(req.body.mail)) {
          return res.status(400).json({ message: "Le mail n'est pas aux bon format (Ex: john.doe@gmail.com)." });
      }
      const hashedPassword = crypto.createHash('sha256').update(req.body.password).digest('hex');
      const existingUser = await usersModel.findOne({
        login: req.body.login,
        password: hashedPassword,
        mail: req.body.mail
      });
      if (existingUser) {
          return res.status(400).json({ message: "Cet user existe déjà." });
      }
      const newUser = new usersModel({
        login: req.body.login,
        password: hashedPassword,
        mail: req.body.mail
      });
      await newUser.save();
      res.status(200).json({ message: "Cet user a été ajouté avec succès." });
  } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Une erreur s'est produite lors de l'ajout du user." });
  }
});

router.put('/users/update', auth(['admin']), async (req, res) => {
  try {
    if (!emailRegex.test(req.body.mail)) {
      return res.status(400).json({ message: "Le mail n'est pas aux bon format (Ex: john.doe@gmail.com)." });
    }
    const hashedPassword = crypto.createHash('sha256').update(req.body.password).digest('hex');
    if (req.body.password.length === 0) {
      const existingUser = await usersModel.findOne({
        login: req.body.login,
        mail: req.body.mail
      });
      if (existingUser) {
          return res.status(400).json({ message: "Cet user n'a pas été modifié." });
      }
      await usersModel.findByIdAndUpdate(req.body.id, {
        login: req.body.login,
        mail: req.body.mail
      }, { new: true });
      res.status(200).json({ message: "L'user a été mis à jour avec succès." });
    } else {
      const updatedUser = await usersModel.findByIdAndUpdate(req.body.id, {
        login: req.body.login,
        password: hashedPassword,
        mail: req.body.mail
      }, { new: true });
      if (!updatedUser) {
        return res.status(400).json({ message: "User non trouvé." });
      }
      res.status(200).json({ message: "L'user a été mis à jour avec succès." });
    }
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erreur serveur lors de la mise à jour du user." });
    }
});

module.exports = router;