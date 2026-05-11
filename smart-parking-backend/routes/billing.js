const express = require('express');
const router = express.Router();
const { Billing } = require('../models');

// GET /api/billing/user/:userId — list all invoices for a user
router.get('/user/:userId', async (req, res) => {
    try {
        const bills = await Billing.findAll({
            where: { UserId: req.params.userId },
            order: [['dueDate', 'DESC']]
        });
        res.json(bills);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// FIX #6: PATCH /api/billing/:id/pay — mark an invoice as paid
router.patch('/:id/pay', async (req, res) => {
    try {
        const bill = await Billing.findByPk(req.params.id);
        if (!bill) return res.status(404).json({ message: 'Bill not found' });

        bill.status = 'paid';
        await bill.save();

        // Broadcast to frontend via Socket.io (FIX #12)
        const io = req.app.get('io');
        io.emit('billing_update', { id: bill.id, status: 'paid', UserId: bill.UserId });

        res.json(bill);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
