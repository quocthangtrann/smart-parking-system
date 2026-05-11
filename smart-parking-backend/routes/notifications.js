const express = require('express');
const router = express.Router();
const { Notification } = require('../models');

// GET /api/notifications/user/:userId — list all notifications for a user
router.get('/user/:userId', async (req, res) => {
    try {
        const notifications = await Notification.findAll({
            where: { UserId: req.params.userId },
            order: [['createdAt', 'DESC']]
        });
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/notifications/broadcast — create notification for specific roles (Admin feature)
router.post('/broadcast', async (req, res) => {
    try {
        const { title, content, targetRole, type } = req.body;
        const { User } = require('../models');

        let users = [];
        if (targetRole === 'All') {
            users = await User.findAll();
        } else {
            users = await User.findAll({ where: { role: targetRole.toLowerCase() } });
        }

        const notificationsData = users.map(u => ({
            title,
            content,
            type: type || 'system',
            UserId: u.id
        }));

        await Notification.bulkCreate(notificationsData);

        const io = req.app.get('io');
        // Emit a general event that the client will filter based on their role, or just broadcast to everyone
        io.emit('new_notification', { title, content, targetRole, type: type || 'system', createdAt: new Date() });
        
        res.status(201).json({ message: `Notification broadcasted to ${users.length} users.` });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// POST /api/notifications — create and broadcast (used internally by MQTT service)
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

// FIX #7: PATCH /api/notifications/:id/read — mark a single notification as read
router.patch('/:id/read', async (req, res) => {
    try {
        const notif = await Notification.findByPk(req.params.id);
        if (!notif) return res.status(404).json({ message: 'Notification not found' });
        notif.isRead = true;
        await notif.save();
        res.json(notif);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// FIX #7: PATCH /api/notifications/user/:userId/read-all — mark all as read
router.patch('/user/:userId/read-all', async (req, res) => {
    try {
        await Notification.update(
            { isRead: true },
            { where: { UserId: req.params.userId, isRead: false } }
        );
        res.json({ message: 'All notifications marked as read' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
