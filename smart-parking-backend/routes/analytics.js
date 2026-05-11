const express = require('express');
const router = express.Router();
const { Billing, sequelize } = require('../models');
const { Op } = require('sequelize');

// GET /api/analytics/revenue
router.get('/revenue', async (req, res) => {
    try {
        const { year, month } = req.query;
        
        let whereClause = { status: 'paid' };
        
        if (year) {
            const startDate = new Date(year, month ? parseInt(month) - 1 : 0, 1);
            const endDate = new Date(year, month ? parseInt(month) : 12, 0, 23, 59, 59);
            whereClause.createdAt = {
                [Op.between]: [startDate, endDate]
            };
        }

        // We want to group by day if month is specified, otherwise by month
        let groupByFormat = month ? '%Y-%m-%d' : '%Y-%m';

        // SQLite specific string date formatting
        const revenueData = await Billing.findAll({
            where: whereClause,
            attributes: [
                [sequelize.fn('strftime', groupByFormat, sequelize.col('createdAt')), 'date'],
                [sequelize.fn('sum', sequelize.col('amount')), 'total']
            ],
            group: [sequelize.fn('strftime', groupByFormat, sequelize.col('createdAt'))],
            order: [[sequelize.fn('strftime', groupByFormat, sequelize.col('createdAt')), 'ASC']],
            raw: true
        });

        res.json(revenueData);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
