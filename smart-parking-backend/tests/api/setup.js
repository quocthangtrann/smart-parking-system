const { sequelize } = require('../../models');

beforeAll(async () => {
    // Sync database before all tests
    process.env.JWT_SECRET = 'test-secret-key';
    await sequelize.sync({ force: true });
});

afterAll(async () => {
    // Close database connection after all tests
    await sequelize.close();
});
