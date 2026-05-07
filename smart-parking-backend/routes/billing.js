const express = require('express');
const router = express.Router();
const { Billing } = require('../models');

router.get('/user/:userId', async (req, res) => {
    try {
        const bills = await Billing.findAll({ where: { UserId: req.params.userId } });
        res.json(bills);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
