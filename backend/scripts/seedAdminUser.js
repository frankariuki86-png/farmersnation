const bcrypt = require('bcryptjs');
const pool = require('../src/config/database');

async function seedAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@farmersnation.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin@123';

  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const existing = await pool.query('SELECT id FROM users WHERE email = $1', [adminEmail]);

  if (existing.rows.length) {
    await pool.query(
      'UPDATE users SET password = $1, role = $2, updated_at = CURRENT_TIMESTAMP WHERE email = $3',
      [passwordHash, 'admin', adminEmail]
    );
    console.log(`Updated existing admin user: ${adminEmail}`);
  } else {
    await pool.query(
      'INSERT INTO users (email, password, first_name, last_name, role) VALUES ($1, $2, $3, $4, $5)',
      [adminEmail, passwordHash, 'Admin', 'User', 'admin']
    );
    console.log(`Created admin user: ${adminEmail}`);
  }
}

seedAdmin()
  .catch((error) => {
    console.error('Failed to seed admin user:', error.message);
    if (error.code === 'ENETUNREACH') {
      console.error('Network cannot reach IPv6 database endpoint. Use an IPv4-capable DB host/pooler or run in an IPv6-enabled environment.');
    }
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });
