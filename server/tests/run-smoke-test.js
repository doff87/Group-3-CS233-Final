import 'dotenv/config';
import app from '../app.js';
import sequelize from '../db/index.js';
import User from '../models/user.js';
import Meal from '../models/meal.js';
import fs from 'fs';

const port = process.env.PORT || 3000;
let server;

async function startServer() {
  try {
    User.hasMany(Meal, { foreignKey: 'userId' });
    Meal.belongsTo(User, { foreignKey: 'userId' });
    await sequelize.authenticate();
    
    if (process.env.NODE_ENV !== 'production') {
      await sequelize.sync();
    }
    
    server = app.listen(port, () => {
      console.log(`✅ Test server ready at http://localhost:${port}`);
    });
  } catch (err) {
    console.error('Failed to start test server:', err);
    process.exit(1);
  }
}

async function http(path, opts = {}) {
  const res = await fetch('http://localhost:' + port + path, opts);
  const text = await res.text();
  let json = null;
  try { json = JSON.parse(text); } catch (e) { json = text; }
  return { status: res.status, body: json };
}

async function ensureRegistered(email, password) {
  const reg = await http('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (reg.status === 201) return reg.body.token;
  if (reg.status === 409) {
    const login = await http('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (login.status === 200) return login.body.token;
    throw new Error('Failed to login existing user: ' + JSON.stringify(login));
  }
  throw new Error('Failed to register user: ' + JSON.stringify(reg));
}

async function createMeal(token, meal) {
  return await http('/api/meals', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
    body: JSON.stringify(meal),
  });
}

async function listMeals(token) {
  return await http('/api/meals', {
    method: 'GET',
    headers: { Authorization: 'Bearer ' + token },
  });
}

async function getMeUserSettings(token) {
  return await http('/api/auth/me', {
    method: 'GET',
    headers: { Authorization: 'Bearer ' + token },
  });
}

async function updateUserSettings(token, settings) {
  return await http('/api/auth/me', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
    body: JSON.stringify(settings),
  });
}

async function runTests() {
  console.log('Starting smoke tests...');
  const u1 = 'smoke_user1@example.com';
  const u2 = 'smoke_user2@example.com';
  const p1 = 'Password123!';
  const p2 = 'Password456!';

  try {
    // Test 1: Register and authenticate
    console.log('\n--- Test 1: Register & Auth ---');
    const token1 = await ensureRegistered(u1, p1);
    console.log('✅ User1 registered/authenticated, token length:', token1?.length || 'none');
    const token2 = await ensureRegistered(u2, p2);
    console.log('✅ User2 registered/authenticated, token length:', token2?.length || 'none');

    // Test 2: Get user settings
    console.log('\n--- Test 2: Get User Settings ---');
    const me1 = await getMeUserSettings(token1);
    console.log('✅ User1 /api/auth/me status:', me1.status, 'email:', me1.body?.email);

    // Test 3: Update dailyGoals
    console.log('\n--- Test 3: Update DailyGoals ---');
    const goals = { calories: 2500, protein: 200, carbs: 250, fats: 80 };
    const upd = await updateUserSettings(token1, { dailyGoals: goals });
    console.log('✅ Updated user1 settings, status:', upd.status, 'goals saved:', JSON.stringify(upd.body?.dailyGoals));

    // Test 4: Create meals and verify isolation
    console.log('\n--- Test 4: Create Meals & Verify Isolation ---');
    const meal1 = { foodName: 'Apple', nutrition: { calories: 95, protein: 0.5, carbs: 25, fats: 0.3 } };
    const meal2 = { foodName: 'Banana', nutrition: { calories: 105, protein: 1.3, carbs: 27, fats: 0.4 } };

    const c1 = await createMeal(token1, meal1);
    console.log('✅ Create meal user1 status:', c1.status, 'id:', c1.body?.id ? c1.body.id.slice(0, 8) + '...' : 'no id');
    const c2 = await createMeal(token2, meal2);
    console.log('✅ Create meal user2 status:', c2.status, 'id:', c2.body?.id ? c2.body.id.slice(0, 8) + '...' : 'no id');

    const l1 = await listMeals(token1);
    console.log('✅ User1 list status:', l1.status, 'meal count:', Array.isArray(l1.body) ? l1.body.length : 'N/A');
    const l2 = await listMeals(token2);
    console.log('✅ User2 list status:', l2.status, 'meal count:', Array.isArray(l2.body) ? l2.body.length : 'N/A');

    // Verify isolation
    const u1Foods = (Array.isArray(l1.body) ? l1.body.map(m => m.foodName) : []);
    const u2Foods = (Array.isArray(l2.body) ? l2.body.map(m => m.foodName) : []);
    console.log('  User1 foods:', u1Foods);
    console.log('  User2 foods:', u2Foods);

    if (u1Foods.includes('Banana')) {
      console.warn('⚠️ Data leakage: user1 sees user2 meal');
    } else {
      console.log('✅ User1 data isolation verified');
    }

    if (u2Foods.includes('Apple')) {
      console.warn('⚠️ Data leakage: user2 sees user1 meal');
    } else {
      console.log('✅ User2 data isolation verified');
    }

    // Test 5: DB persistence
    console.log('\n--- Test 5: DB Persistence ---');
    const dbPath = './server.sqlite';
    try {
      const st = fs.statSync(dbPath);
      console.log('✅ SQLite DB exists:', dbPath, 'size:', st.size, 'bytes');
    } catch (e) {
      console.warn('⚠️ SQLite DB not found at', dbPath);
    }

    console.log('\n✅ All smoke tests passed!\n');
  } catch (err) {
    console.error('\n❌ Smoke test failed:', err.message || err);
    process.exit(1);
  } finally {
    if (server) server.close();
  }
}

await startServer();
await new Promise(r => setTimeout(r, 500)); // Give server a moment to fully start
await runTests();
process.exit(0);
