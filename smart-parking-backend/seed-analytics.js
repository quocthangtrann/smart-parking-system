const { sequelize, Billing, User } = require('./models');

async function seedAnalytics() {
    try {
        await sequelize.authenticate();
        console.log('Connected to database.');

        // Get a user to attach billings to
        const user = await User.findOne();
        const userId = user ? user.id : null;

        if (!userId) {
            console.error('No users found. Please run seed.js first.');
            process.exit(1);
        }

        console.log('Generating 12 months of fake billing data...');

        const billings = [];
        const today = new Date();
        
        // Generate for the past 12 months
        for (let i = 0; i < 12; i++) {
            // For each month, generate 5-15 random paid bills
            const numBills = Math.floor(Math.random() * 10) + 5;
            
            for (let j = 0; j < numBills; j++) {
                // Random day within the month
                const day = Math.floor(Math.random() * 28) + 1;
                
                // Create a date for the specific month/year
                const date = new Date(today.getFullYear(), today.getMonth() - i, day);
                
                // Random amount between 2k and 50k
                const amounts = [2000, 3000, 4000, 10000, 20000, 30000];
                const amount = amounts[Math.floor(Math.random() * amounts.length)];

                billings.push({
                    amount: amount,
                    status: 'paid',
                    dueDate: date,
                    createdAt: date,
                    updatedAt: date,
                    UserId: userId
                });
            }
        }

        await Billing.bulkCreate(billings);
        console.log(`Successfully created ${billings.length} historical billing records.`);
        process.exit(0);
    } catch (err) {
        console.error('Error seeding analytics:', err);
        process.exit(1);
    }
}

seedAnalytics();
