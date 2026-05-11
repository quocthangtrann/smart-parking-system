const express = require('express');
const router = express.Router();
const { ParkingSession, Vehicle } = require('../models');

// GET /api/sessions/user/:userId — all sessions for a user
router.get('/user/:userId', async (req, res) => {
    try {
        const sessions = await ParkingSession.findAll({
            where: { UserId: req.params.userId },
            order: [['enterTime', 'DESC']],
            include: [{ model: Vehicle }]
        });
        res.json(sessions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// FIX #9: GET /api/sessions/user/:userId/active — current active session
router.get('/user/:userId/active', async (req, res) => {
    try {
        const session = await ParkingSession.findOne({
            where: { UserId: req.params.userId, status: 'active' },
            order: [['enterTime', 'DESC']],
            include: [{ model: Vehicle }]
        });
        res.json(session || null);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
