const express = require('express');
const router = express.Router();
const { ParkingSession } = require('../models');

router.get('/user/:userId', async (req, res) => {
    try {
        const sessions = await ParkingSession.findAll({ where: { UserId: req.params.userId } });
        res.json(sessions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
