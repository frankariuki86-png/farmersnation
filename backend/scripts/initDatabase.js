const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

async function ensureDatabaseExists() {
  const rawUrl = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/farmers_nation_db';
  const parsed = new URL(rawUrl);
  const dbName = parsed.pathname.replace('/', '');

  if (!/^[a-zA-Z0-9_]+$/.test(dbName)) {
    throw new Error('Invalid database name in DATABASE_URL');
  }

  parsed.pathname = '/postgres';
  const adminClient = new Client({ connectionString: parsed.toString() });

  await adminClient.connect();
  const exists = await adminClient.query('SELECT 1 FROM pg_database WHERE datname = $1', [dbName]);

  if (!exists.rowCount) {
    await adminClient.query(`CREATE DATABASE ${dbName}`);
    console.log(`Created database: ${dbName}`);
  } else {
    console.log(`Database already exists: ${dbName}`);
  }

  await adminClient.end();
  return rawUrl;
}

function loadSchemaSql() {
  const schemaPath = path.join(__dirname, '..', 'src', 'config', 'database.sql');
  const rawSql = fs.readFileSync(schemaPath, 'utf8');

  return rawSql
    .split(/\r?\n/)
    .filter((line) => !/^\s*CREATE\s+DATABASE\b/i.test(line))
    .filter((line) => !/^\s*\\c\s+/i.test(line))
    .join('\n');
}

async function applySchema(connectionString) {
  const schemaClient = new Client({ connectionString });
  const sql = loadSchemaSql();

  await schemaClient.connect();
  await schemaClient.query(sql);
  await schemaClient.end();
  console.log('Schema applied successfully.');
}

async function main() {
  const dbUrl = await ensureDatabaseExists();
  await applySchema(dbUrl);
}

main().catch((error) => {
  console.error('Database initialization failed:', error.message);
  process.exit(1);
});
