const express = require('express');
const router = express.Router();
const { Vehicle } = require('../models');

router.get('/user/:userId', async (req, res) => {
    try {
        const vehicles = await Vehicle.findAll({ where: { UserId: req.params.userId } });
        res.json(vehicles);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
