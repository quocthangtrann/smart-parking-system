const express = require('express');
const router = express.Router();
const { Vehicle } = require('../models');

// GET /api/vehicles/user/:userId — list all vehicles for a user
router.get('/user/:userId', async (req, res) => {
    try {
        const vehicles = await Vehicle.findAll({ where: { UserId: req.params.userId } });
        res.json(vehicles);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// FIX #5: POST /api/vehicles — register a new vehicle
router.post('/', async (req, res) => {
    try {
        const { licensePlate, vehicleType, brand, isDefault, UserId } = req.body;
        if (!licensePlate || !UserId) {
            return res.status(400).json({ message: 'licensePlate and UserId are required' });
        }
        // If new vehicle is set as default, clear existing defaults for this user
        if (isDefault) {
            await Vehicle.update({ isDefault: false }, { where: { UserId } });
        }
        const vehicle = await Vehicle.create({
            licensePlate,
            vehicleType,
            brand,
            isDefault: !!isDefault,
            UserId
        });
        res.status(201).json(vehicle);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// FIX #5: DELETE /api/vehicles/:id — remove a vehicle
router.delete('/:id', async (req, res) => {
    try {
        const vehicle = await Vehicle.findByPk(req.params.id);
        if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });

        const wasDefault = vehicle.isDefault;
        const userId = vehicle.UserId;
        await vehicle.destroy();

        // If the deleted vehicle was default, promote the next one
        if (wasDefault) {
            const next = await Vehicle.findOne({ where: { UserId: userId } });
            if (next) { next.isDefault = true; await next.save(); }
        }
        res.json({ message: 'Vehicle deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
