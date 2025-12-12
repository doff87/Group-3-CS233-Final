import 'dotenv/config';
import app from './app.js';
import sequelize from './db/index.js';
import User from './models/user.js';
import Meal from './models/meal.js';

// Determine the port from the environment, defaulting to 3000.
const port = process.env.PORT || 3000;

async function start() {
  try {
    // Define associations so Sequelize creates foreign keys correctly
    User.hasMany(Meal, { foreignKey: 'userId' });
    Meal.belongsTo(User, { foreignKey: 'userId' });

    // Authenticate DB connection
    await sequelize.authenticate();

    // In development: use safe sequelize.sync() to keep DX fast.
    // In production: assume migrations are applied via CI/deploy tooling.
    if (process.env.NODE_ENV === 'production') {
      console.log('⚠️ Running in production: migrations must be applied separately (run `npm run db:migrate`)');
    } else {
      await sequelize.sync();
      console.log('✅ Database connected and models synced (development sync)');
    }
    app.listen(port, () => {
      console.log(`✅ API ready at http://localhost:${port}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();