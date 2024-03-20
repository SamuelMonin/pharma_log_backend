const express = require('express');
const router = express.Router();
const administratorsModel = require('../models/Administrators');
const crypto = require('crypto');

router.use(cors());

router.post('/administrators/login', async (req, res) => {
    try {
        const { login, password } = req.body;
        if (!login || !password) {
            return res.status(400).json({ success: false, error: "Login et mot de passe sont requis" });
        }

        const administrator = await administratorsModel.findOne({ login });
        if (!administrator) {
            return res.status(401).json({ success: false, error: "L'administrateur n'existe pas" });
        }

        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
        if (hashedPassword !== administrator.password) {
            return res.status(401).json({ success: false, error: "Mot de passe incorrect" });
        }

        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Erreur serveur' });
    }
});

module.exports = router;