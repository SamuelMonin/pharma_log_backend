const express = require('express');
const router = express.Router();
const productsModel = require('../models/Products');

router.get('/products', async (req, res) => {
    try {
      const products = await productsModel.find({});
      res.json(products);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
});

router.post('/products/delete', async (req, res) => {
  try {
    const { id } = req.body;
    const deletedProduct = await productsModel.findByIdAndDelete(id);
    if (!deletedProduct) {
        return res.status(404).json({ error: 'Produit non trouvé' });
    }
    res.json({ message: 'Produit supprimé avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.post('/products/add', async (req, res) => {

  const numberRegex = /^[0-9]+(\.[0-9]+)?$/;

  try {

      if (!numberRegex.test(req.body.price)) {
          return res.status(200).json({ success: false, message: "Le prix doit-être un nombre (Ex : 1.99)." });
      }

      if (!numberRegex.test(req.body.score)) {
          return res.status(200).json({ success: false, message: "Le score doit-être un nombre (Ex : 1.99)." });
      }

      const existingProduct = await productsModel.findOne({
        description: req.body.description,
        price: req.body.price,
        score: req.body.score
      });

      if (existingProduct) {
          return res.status(200).json({ success: false, message: "Ce produit existe déjà." });
      }

      const newProduct = new productsModel({
        description: req.body.description,
        price: req.body.price,
        score: req.body.score
      });

      await newProduct.save();

      res.status(200).json({ success: true, message: "Le produit a été ajouté avec succès." });

  } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Une erreur s'est produite lors de l'ajout du produit." });
  }
});

router.put('/products/update', async (req, res) => {

  const numberRegex = /^[0-9]+(\.[0-9]+)?$/;

  try {
        
    if (!numberRegex.test(req.body.price)) {
      return res.status(200).json({ success: false, message: "Le prix doit-être un nombre (Ex : 1.99)." });
    }

    if (!numberRegex.test(req.body.score)) {
      return res.status(200).json({ success: false, message: "Le score doit-être un nombre (Ex : 1.99)." });
    }

    const existingProduct = await productsModel.findOne({
      description: req.body.description,
      price: req.body.price,
      score: req.body.score
    });

    if (existingProduct) {
        return res.status(200).json({ success: false, message: "Ce produit n'a pas été modifié." });
    }

    const updatedProduct = await productsModel.findByIdAndUpdate(req.body.id, {
      description: req.body.description,
      price: req.body.price,
      score: req.body.score
      }, { new: true });

    if (!updatedProduct) {
      return res.status(200).json({ success: false, message: "Produit non trouvé." });
    }

    res.status(200).json({ success: true, message: "Le produit a été mis à jour avec succès." });

    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: "Erreur serveur lors de la mise à jour du produit." });
    }
});

module.exports = router;