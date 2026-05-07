require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, User, ParkingSlot, Device } = require('./models');

const seed = async () => {
    try {
        await sequelize.sync({ force: true });
        console.log('Database cleared and synced');

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('123', salt);

        // Sample Users
        const users = [
            { username: 'student1', password: hashedPassword, fullName: 'Student One', role: 'student', email: 's1@hcmut.edu.vn' },
            { username: 'student2', password: hashedPassword, fullName: 'Student Two', role: 'student', email: 's2@hcmut.edu.vn' },
            { username: 'student3', password: hashedPassword, fullName: 'Student Three', role: 'student', email: 's3@hcmut.edu.vn' },
            { username: 'lecturer1', password: hashedPassword, fullName: 'Lecturer One', role: 'lecturer', email: 'l1@hcmut.edu.vn' },
            { username: 'lecturer2', password: hashedPassword, fullName: 'Lecturer Two', role: 'lecturer', email: 'l2@hcmut.edu.vn' },
            { username: 'admin1', password: hashedPassword, fullName: 'Admin One', role: 'admin', email: 'admin1@hcmut.edu.vn' },
            { username: 'admin2', password: hashedPassword, fullName: 'Admin Two', role: 'admin', email: 'admin2@hcmut.edu.vn' },
        ];
        await User.bulkCreate(users);
        console.log('Users seeded');

        // Sample Slots
        const devices = [
            { id: 'CAM-G1-01', type: 'Camera', position: 'Gate 1 Entry', state: 'online', responseTime: 120 },
            { id: 'SEN-G1-A01', type: 'Sensor', position: 'Slot A01', state: 'error', responseTime: 0 },
            { id: 'BAR-G1-01', type: 'Barrier', position: 'Gate 1 Exit', state: 'online', responseTime: 450 },
        ];
        await Device.bulkCreate(devices);
        console.log('Devices seeded');

        console.log('Seeding completed successfully');
        process.exit(0);
    } catch (err) {
        console.error('Seeding failed:', err);
        process.exit(1);
    }
};

seed();
