const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const vehicleRoutes = require('../../routes/vehicles');
const { Vehicle, User, sequelize } = require('../../models');

const app = express();
app.use(bodyParser.json());
app.use('/api/vehicles', vehicleRoutes);

describe('Vehicles API', () => {
    let testUser;

    beforeAll(async () => {
        await sequelize.sync({ force: true });
        testUser = await User.create({
            id: '550e8400-e29b-41d4-a716-446655440000',
            username: 'carowner',
            password: 'hashedpassword',
            fullName: 'Car Owner'
        });
    });

    it('should create a new vehicle', async () => {
        const res = await request(app)
            .post('/api/vehicles')
            .send({
                licensePlate: 'ABC-1234',
                vehicleType: 'car',
                brand: 'Toyota',
                UserId: testUser.id,
                isDefault: true
            });
        
        expect(res.statusCode).toEqual(201);
        expect(res.body.licensePlate).toEqual('ABC-1234');
    });

    it('should retrieve vehicles for a user', async () => {
        const res = await request(app)
            .get(`/api/vehicles/user/${testUser.id}`);
        
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
    });

    it('should delete a vehicle', async () => {
        const vehicle = await Vehicle.findOne({ where: { licensePlate: 'ABC-1234' } });
        const res = await request(app)
            .delete(`/api/vehicles/${vehicle.id}`);
        
        expect(res.statusCode).toEqual(200);
        
        const deleted = await Vehicle.findByPk(vehicle.id);
        expect(deleted).toBeNull();
    });
});
