const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const billingRoutes = require('../../routes/billing');
const { Billing, User, sequelize } = require('../../models');

const app = express();
app.use(bodyParser.json());
app.use('/api/billing', billingRoutes);
app.set('io', { emit: jest.fn() });

describe('Billing API', () => {
    let testUser, testInvoice;

    beforeAll(async () => {
        await sequelize.sync({ force: true });
        testUser = await User.create({
            id: '660e8400-e29b-41d4-a716-446655440001',
            username: 'payer',
            password: 'password'
        });
        testInvoice = await Billing.create({
            id: '770e8400-e29b-41d4-a716-446655440002',
            amount: 50.0,
            status: 'unpaid',
            UserId: testUser.id
        });
    });

    it('should pay an invoice successfully', async () => {
        const res = await request(app)
            .patch(`/api/billing/${testInvoice.id}/pay`)
            .send();
        
        expect(res.statusCode).toEqual(200);
        expect(res.body.status).toEqual('paid');
        
        const updated = await Billing.findByPk(testInvoice.id);
        expect(updated.status).toEqual('paid');
    });

    it('should return 404 for non-existent invoice', async () => {
        const res = await request(app)
            .patch('/api/billing/00000000-0000-0000-0000-000000000000/pay')
            .send();
        
        expect(res.statusCode).toEqual(404);
    });
});
