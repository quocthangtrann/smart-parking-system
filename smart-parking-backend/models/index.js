const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: process.env.DB_STORAGE || path.join(__dirname, '../database.sqlite'),
    logging: false
});

const User = sequelize.define('User', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    username: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    fullName: { type: DataTypes.STRING },
    role: { type: DataTypes.ENUM('student', 'lecturer', 'admin'), defaultValue: 'student' },
    email: { type: DataTypes.STRING },
    phone: { type: DataTypes.STRING }
});

const Vehicle = sequelize.define('Vehicle', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    licensePlate: { type: DataTypes.STRING, unique: true },
    vehicleType: { type: DataTypes.STRING },
    brand: { type: DataTypes.STRING },
    isDefault: { type: DataTypes.BOOLEAN, defaultValue: false }
});

const ParkingSlot = sequelize.define('ParkingSlot', {
    id: { type: DataTypes.STRING, primaryKey: true }, // e.g. SNS-A01
    gate: { type: DataTypes.STRING },
    zone: { type: DataTypes.STRING },
    slotCode: { type: DataTypes.STRING },
    state: { type: DataTypes.ENUM('active', 'occupied', 'maintenance', 'error', 'empty', 'reserved'), defaultValue: 'empty' }
});

const ParkingSession = sequelize.define('ParkingSession', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    gate: { type: DataTypes.STRING },
    slot: { type: DataTypes.STRING },
    enterTime: { type: DataTypes.DATE },
    exitTime: { type: DataTypes.DATE },
    status: { type: DataTypes.STRING }, // active, completed
    fee: { type: DataTypes.FLOAT, defaultValue: 0 }
});

const Device = sequelize.define('Device', {
    id: { type: DataTypes.STRING, primaryKey: true },
    type: { type: DataTypes.STRING },
    position: { type: DataTypes.STRING },
    state: { type: DataTypes.ENUM('online', 'disconnected', 'maintenance', 'error'), defaultValue: 'online' },
    responseTime: { type: DataTypes.INTEGER }
});

const Notification = sequelize.define('Notification', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    type: { type: DataTypes.STRING },
    title: { type: DataTypes.STRING },
    content: { type: DataTypes.TEXT },
    isRead: { type: DataTypes.BOOLEAN, defaultValue: false }
});

const Billing = sequelize.define('Billing', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    amount: { type: DataTypes.FLOAT },
    status: { type: DataTypes.STRING }, // pending, paid
    dueDate: { type: DataTypes.DATE }
});

const FeePolicy = sequelize.define('FeePolicy', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    vehicleType: { type: DataTypes.STRING, allowNull: false },
    daytimeRate: { type: DataTypes.INTEGER, allowNull: false },
    eveningRate: { type: DataTypes.INTEGER, allowNull: false },
    timeThreshold: { type: DataTypes.STRING, allowNull: false }, // e.g., '18:00'
    effectiveFrom: { type: DataTypes.DATE, allowNull: false },
    effectiveTo: { type: DataTypes.DATE },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true }
});

// Associations
User.hasMany(Vehicle);
Vehicle.belongsTo(User);

User.hasMany(ParkingSession);
ParkingSession.belongsTo(User);

Vehicle.hasMany(ParkingSession);
ParkingSession.belongsTo(Vehicle);

User.hasMany(Notification);
Notification.belongsTo(User);

User.hasMany(Billing);
Billing.belongsTo(User);

module.exports = {
    sequelize,
    User,
    Vehicle,
    ParkingSlot,
    ParkingSession,
    Device,
    Notification,
    Billing,
    FeePolicy
};
