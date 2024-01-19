const express = require('express');
const router = express.Router();
const usersModel = require('../models/Users');

router.get('/users', async (req, res) => {
    try {
      const users = await usersModel.find({});
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
});

router.post('/users/put-item', async (req, res) => {

    try {
        await usersModel.updateOne({
            login: req.body.login
        },
            {
                $set: {
                    login: req.body.login,
                    password: req.body.password,
                }
            },
            { upsert: true }
        );
        res.status(200).json({ saved: true });
    } catch (err) {
        console.log(err)
        res.json(err);
    }
});

module.exports = router;
