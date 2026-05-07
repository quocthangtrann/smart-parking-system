const express = require('express');
const router = express.Router();
const { Device } = require('../models');

router.get('/', async (req, res) => {
    try {
        const devices = await Device.findAll();
        res.json(devices);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
