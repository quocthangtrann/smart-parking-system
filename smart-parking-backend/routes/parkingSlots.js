const express = require('express');
const router = express.Router();
const { ParkingSlot } = require('../models');

router.get('/', async (req, res) => {
    try {
        const slots = await ParkingSlot.findAll();
        res.json(slots);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const slot = await ParkingSlot.findByPk(req.params.id);
        if (!slot) return res.status(404).json({ message: 'Slot not found' });
        res.json(slot);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
