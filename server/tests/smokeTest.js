import fs from 'fs';

const base = 'http://localhost:3000';

async function http(path, opts = {}) {
  const res = await fetch(base + path, opts);
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
    // Already exists — login instead
    const login = await http('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (login.status === 200) return login.body.token;
    throw new Error('Failed to login existing user: ' + JSON.stringify(login));
  }
  if (reg.status === 200 && reg.body?.token) return reg.body.token;
  throw new Error('Failed to register user: ' + JSON.stringify(reg));
}

async function createMeal(token, meal) {
  const res = await http('/api/meals', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
    body: JSON.stringify(meal),
  });
  return res;
}

async function listMeals(token) {
  return await http('/api/meals', {
    method: 'GET',
    headers: { Authorization: 'Bearer ' + token },
  });
}

async function run() {
  console.log('Starting smoke tests against', base);
  const u1 = 'smoke_user1@example.com';
  const u2 = 'smoke_user2@example.com';
  const p1 = 'Password123!';
  const p2 = 'Password456!';

  const token1 = await ensureRegistered(u1, p1);
  console.log('User1 token length', token1?.length || 'none');
  const token2 = await ensureRegistered(u2, p2);
  console.log('User2 token length', token2?.length || 'none');

  const meal1 = { foodName: 'Apple', nutrition: { calories: 95, protein: 0.5, carbs: 25, fats: 0.3 } };
  const meal2 = { foodName: 'Banana', nutrition: { calories: 105, protein: 1.3, carbs: 27, fats: 0.4 } };

  const c1 = await createMeal(token1, meal1);
  console.log('Create meal user1 status', c1.status, c1.body?.id ? 'id=' + c1.body.id : 'no id');
  const c2 = await createMeal(token2, meal2);
  console.log('Create meal user2 status', c2.status, c2.body?.id ? 'id=' + c2.body.id : 'no id');

  const l1 = await listMeals(token1);
  console.log('User1 list status', l1.status, 'count=', Array.isArray(l1.body) ? l1.body.length : 'N/A');
  const l2 = await listMeals(token2);
  console.log('User2 list status', l2.status, 'count=', Array.isArray(l2.body) ? l2.body.length : 'N/A');

  // Verify isolation: user1 should not see user2's foodName unless both share same
  const u1Foods = (Array.isArray(l1.body) ? l1.body.map(m => m.foodName) : []);
  const u2Foods = (Array.isArray(l2.body) ? l2.body.map(m => m.foodName) : []);
  console.log('User1 foods:', u1Foods);
  console.log('User2 foods:', u2Foods);

  if (u1Foods.includes('Banana')) console.warn('Data leakage: user1 sees user2 meal');
  if (u2Foods.includes('Apple')) console.warn('Data leakage: user2 sees user1 meal');

  // Check persistence: ensure server.sqlite file exists and has size
  const dbPath = './server.sqlite';
  try {
    const st = fs.statSync(dbPath);
    console.log('SQLite DB exists:', dbPath, 'size=', st.size);
  } catch (e) {
    console.warn('SQLite DB not found at', dbPath);
  }

  console.log('Smoke tests complete');
}

run().catch(err => {
  console.error('Smoke tests failed:', err);
  process.exit(1);
});
