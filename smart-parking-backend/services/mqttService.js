const mqtt = require('mqtt');
const { ParkingSlot, ParkingSession, User, Notification, Device, FeePolicy, Vehicle, Billing } = require('../models');

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

            // ── Parking Sensor (slot occupancy) ───────────────────────────
            if (topic.startsWith('parking-')) {
                const slotId = `SNS-${payload.slot}`;
                const [slot] = await ParkingSlot.findOrCreate({
                    where: { id: slotId },
                    defaults: {
                        gate: `Gate ${payload.lot}`,
                        zone: payload.slot.split('-')[0],
                        slotCode: payload.slot
                    }
                });

                // FIX #10: normalize to exact ENUM values ('occupied' | 'empty')
                slot.state = payload.status === 'occupied' ? 'occupied' : 'empty';
                await slot.save();

                io.emit('slot_update', slot);
            }

            // ── Member / Guest Check-in & Check-out ───────────────────────
            if (topic === 'MEMBER' || topic === 'GUEST') {
                const rawId = payload.member_id || payload.guest_id;
                const type = payload.status; // 'checkin' or 'checkout'

                // FIX #2: look up user by username (student/staff code), not by raw string as UUID
                let userId = null;
                if (rawId) {
                    const user = await User.findOne({ where: { username: rawId } });
                    userId = user?.id ?? null;
                    if (!userId) {
                        console.warn(`[MQTT] No user found with username: ${rawId}`);
                    }
                }

                // FIX #11: explicit checkin/checkout branches instead of implicit else
                if (type === 'checkin') {
                    const session = await ParkingSession.create({
                        gate: `Gate ${payload.lot}`,
                        slot: 'Searching...',
                        enterTime: new Date(),
                        status: 'active',
                        UserId: userId
                    });
                    io.emit('session_update', { userId, type, session });

                } else if (type === 'checkout') {
                    const session = await ParkingSession.findOne({
                        where: { UserId: userId, status: 'active' },
                        order: [['enterTime', 'DESC']]
                    });
                    if (session) {
                        session.exitTime = new Date();
                        session.status = 'completed';

                        // --- DYNAMIC FEE CALCULATION ---
                        let finalFee = 10000; // Fallback default
                        try {
                            // Find default vehicle or just first one
                            const vehicle = await Vehicle.findOne({ where: { UserId: userId }, order: [['isDefault', 'DESC']] });
                            const vType = vehicle ? vehicle.vehicleType : 'Motorbike'; // Default to motorbike

                            const policy = await FeePolicy.findOne({ where: { vehicleType: vType, isActive: true } });
                            if (policy) {
                                const now = new Date();
                                const isSunday = now.getDay() === 0;

                                // Parse threshold (e.g., "18:00")
                                const [threshHour, threshMin] = policy.timeThreshold.split(':').map(Number);
                                const currentHour = now.getHours();
                                const currentMin = now.getMinutes();

                                const isEvening = (currentHour > threshHour) || (currentHour === threshHour && currentMin >= threshMin);

                                if (isSunday || isEvening) {
                                    finalFee = policy.eveningRate;
                                } else {
                                    finalFee = policy.daytimeRate;
                                }
                            }
                        } catch (calcErr) {
                            console.error('[MQTT] Fee calculation error:', calcErr);
                        }

                        session.fee = finalFee;
                        await session.save();

                        // Create Billing Record
                        const billing = await Billing.create({
                            amount: finalFee,
                            status: 'pending',
                            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Due in 7 days
                            UserId: userId
                        });

                        io.emit('billing_update', { userId, amount: finalFee, sessionId: session.id, billingId: billing.id });
                    }
                    io.emit('session_update', { userId, type });

                } else {
                    console.warn(`[MQTT] Unknown status "${type}" on topic ${topic}`);
                }
            }

            // ── Device Health Status ───────────────────────────────────────
            if (topic === 'device/status') {
                const [device] = await Device.findOrCreate({
                    where: { id: payload.device_id },
                    defaults: {
                        type: payload.type || 'sensor',
                        position: payload.position || 'Unknown'
                    }
                });

                const validStates = ['online', 'disconnected', 'maintenance', 'error'];
                device.state = validStates.includes(payload.state) ? payload.state : 'online';
                device.responseTime = payload.responseTime || 100;
                await device.save();

                io.emit('device_update', device);
            }

            // ── Environmental Alert ────────────────────────────────────────
            if (topic === 'parking/environment') {
                if (payload.smoke === 'DETECTED' || payload.temp > 50) {
                    const alert = await Notification.create({
                        type: 'SECURITY',
                        title: 'ENVIRONMENTAL ALERT',
                        content: `Emergency: ${payload.smoke === 'DETECTED' ? 'Smoke detected' : 'High temperature'} at ${payload.location}`,
                        isRead: false
                    });
                    // FIX #12: emit 'new_notification' (consistent event name)
                    io.emit('new_notification', alert);
                }
            }

        } catch (err) {
            console.error('MQTT Processing Error:', err);
        }
    });

    return client;
};

module.exports = initMQTT;
