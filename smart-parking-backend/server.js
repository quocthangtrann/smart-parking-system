require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { sequelize } = require('./models');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});

app.use(cors());
app.use(express.json());

// Routes placeholder
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/vehicles', require('./routes/vehicles'));
app.use('/api/parking-slots', require('./routes/parkingSlots'));
app.use('/api/sessions', require('./routes/sessions'));
app.use('/api/devices', require('./routes/devices'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/billing', require('./routes/billing'));

// Socket.io connection
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    socket.on('disconnect', () => console.log('Client disconnected'));
});

// Initialize MQTT
const initMQTT = require('./services/mqttService');
const mqttClient = initMQTT(io);

// Attach io to app for use in routes/controllers
app.set('io', io);

const PORT = process.env.PORT || 5001;

sequelize.sync({ force: false }).then(() => {
    console.log('Database synced');
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Unable to sync database:', err);
});
