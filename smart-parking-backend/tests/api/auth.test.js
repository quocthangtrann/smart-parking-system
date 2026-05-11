const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('../../routes/auth');
const { User, sequelize } = require('../../models');
const bcrypt = require('bcryptjs');

const app = express();
app.use(bodyParser.json());
app.use('/api/auth', authRoutes);

describe('Auth API', () => {
    beforeAll(async () => {
        await sequelize.sync({ force: true });
        const hashedPassword = await bcrypt.hash('password123', 10);
        await User.create({
            username: 'testuser',
            password: hashedPassword,
            fullName: 'Test User',
            role: 'student',
            email: 'test@example.com'
        });
    });

    it('should login successfully with correct credentials', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                username: 'testuser',
                password: 'password123'
            });
        
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
        expect(res.body.user.username).toEqual('testuser');
    });

    it('should fail login with wrong password', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                username: 'testuser',
                password: 'wrongpassword'
            });
        
        expect(res.statusCode).toEqual(401);
        expect(res.body.message).toEqual('Invalid credentials');
    });

    it('should fail login for non-existent user', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                username: 'nonexistent',
                password: 'password123'
            });
        
        expect(res.statusCode).toEqual(404);
    });
});
