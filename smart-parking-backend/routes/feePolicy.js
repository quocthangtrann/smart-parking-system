const express = require('express');
const router = express.Router();
const { FeePolicy } = require('../models');

// GET all active fee policies
router.get('/', async (req, res) => {
    try {
        const policies = await FeePolicy.findAll({
            where: { isActive: true },
            order: [['createdAt', 'DESC']]
        });
        res.json(policies);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST a new fee policy
router.post('/', async (req, res) => {
    try {
        const { vehicleType, price, effectiveDate } = req.body;

        // Validation
        if (!vehicleType || !['Car', 'Motorbike', 'Bicycle'].includes(vehicleType)) {
            return res.status(400).json({ message: 'Invalid vehicle type' });
        }
        if (typeof price !== 'number' || price < 0) {
            return res.status(400).json({ message: 'Price must be a valid positive number' });
        }
        const parsedDate = new Date(effectiveDate);
        if (isNaN(parsedDate.getTime())) {
            return res.status(400).json({ message: 'Invalid effective date' });
        }

        // Deactivate previous active policies for the same vehicle type
        await FeePolicy.update(
            { isActive: false },
            { where: { vehicleType: vehicleType, isActive: true } }
        );

        // Create the new policy
        const newPolicy = await FeePolicy.create({
            vehicleType,
            price,
            effectiveDate: parsedDate,
            isActive: true
        });

        res.status(201).json(newPolicy);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
