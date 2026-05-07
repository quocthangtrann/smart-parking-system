const express = require('express');
const router = express.Router();
const { Notification } = require('../models');

router.get('/user/:userId', async (req, res) => {
    try {
        const notifications = await Notification.findAll({ where: { UserId: req.params.userId } });
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const notification = await Notification.create(req.body);
        const io = req.app.get('io');
        io.emit('new_notification', notification);
        res.status(201).json(notification);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
