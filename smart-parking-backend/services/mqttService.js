const mqtt = require('mqtt');
const { ParkingSlot, ParkingSession, User, Notification, Device } = require('../models');

const initMQTT = (io) => {
    const client = mqtt.connect(process.env.MQTT_BROKER_URL || 'mqtt://localhost:1883');

    client.on('connect', () => {
        console.log('Connected to MQTT Broker');
        client.subscribe([
            'MEMBER', 
            'GUEST', 
            'parking-A-sensor', 
            'parking-B-sensor', 
            'parking-C-sensor',
            'device/status',
            'parking/environment'
        ]);
    });

    client.on('message', async (topic, message) => {
        try {
            const payload = JSON.parse(message.toString());
            console.log(`MQTT [${topic}]:`, payload);

            if (topic.startsWith('parking-')) {
                // Update Slot Status (Occupancy)
                const slotId = `SNS-${payload.slot}`;
                const [slot] = await ParkingSlot.findOrCreate({ 
                    where: { id: slotId },
                    defaults: {
                        gate: `Gate ${payload.lot}`,
                        zone: payload.slot.split('-')[0],
                        slotCode: payload.slot
                    }
                });
                
                // Rules: occupied -> active, empty -> empty
                slot.state = payload.status === 'occupied' ? 'active' : 'empty';
                await slot.save();
                
                io.emit('slot_update', slot);
            }

            if (topic === 'MEMBER' || topic === 'GUEST') {
                // Handle Check-in/Check-out
                const userId = payload.member_id || payload.guest_id;
                const type = payload.status; 
                
                if (type === 'checkin') {
                    await ParkingSession.create({
                        gate: `Gate ${payload.lot}`,
                        slot: 'Searching...',
                        enterTime: new Date(),
                        status: 'active',
                        UserId: userId 
                    });
                } else {
                    const session = await ParkingSession.findOne({ 
                        where: { status: 'active' },
                        order: [['enterTime', 'DESC']]
                    });
                    if (session) {
                        session.exitTime = new Date();
                        session.status = 'completed';
                        session.fee = 10000;
                        await session.save();
                        
                        // Notify user of billing
                        io.emit('billing_update', { userId, amount: 10000 });
                    }
                }
                io.emit('session_update', { userId, type });
            }

            if (topic === 'device/status') {
                // Realtime Device Health Sync
                const [device] = await Device.findOrCreate({ where: { id: payload.device_id } });
                device.state = payload.state; // online, offline, error, maintenance
                device.responseTime = payload.responseTime || 100;
                await device.save();
                
                io.emit('device_update', device);
            }

            if (topic === 'parking/environment') {
                // Temperature / Smoke Alerting
                if (payload.smoke === 'DETECTED' || payload.temp > 50) {
                    const alert = await Notification.create({
                        type: 'SECURITY',
                        title: 'ENVIRONMENTAL ALERT',
                        content: `Emergency: ${payload.smoke === 'DETECTED' ? 'Smoke detected' : 'High temperature'} at ${payload.location}`,
                        isRead: false
                    });
                    io.emit('notification_update', alert);
                }
            }

        } catch (err) {
            console.error('MQTT Processing Error:', err);
        }
    });

    return client;
};

module.exports = initMQTT;
