const express = require('express');
const router = express.Router();
const cors = require('cors');
const administratorsModel = require('../models/Administrators');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

// router.use(cors());

router.post('/administrators/login', async (req, res) => {
    try {
        const { login, password } = req.body;
        if (!login || !password) {
            return res.status(400).json({ message: "Saisissez vos identifiants." });
        }
        const administrator = await administratorsModel.findOne({ login });
        if (!administrator) {
            return res.status(401).json({ message: "Login incorrect." });
        }
        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
        if (hashedPassword !== administrator.password) {
            return res.status(401).json({ message: "Mot de passe incorrect." });
        }
        const profil = administrator.profil

        let token = jwt.sign(
            {
                login: login,
                profil: profil
            },
            "SAM_S_SECRET",
            { expiresIn: "3 days" }
        );
        res.json({ success: true, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Erreur serveur' });
    }
});

module.exports = router;