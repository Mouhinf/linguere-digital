/**
 * Migration SQLite vers MySQL
 * Commande: node migrate-sqlite-to-mysql.js
 */
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const TABLES = ['Users', 'Messages', 'Services', 'Projects', 'BlogPosts', 'Testimonials', 'Settings'];

async function migrate() {
  const Sequelize = require('sequelize');

  const sqliteDb = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, 'dev.sqlite'),
    logging: false
  });

  await sqliteDb.authenticate();
  console.log('Connexion SQLite OK');

  let dump = 'SET NAMES utf8mb4;\n';
  dump += 'SET FOREIGN_KEY_CHECKS = 0;\n\n';

  for (const tableName of TABLES) {
    const [rows] = await sqliteDb.query(`SELECT * FROM \`${tableName}\``);
    if (!rows || rows.length === 0) {
      console.log(`Table ${tableName}: vide (skip)`);
      continue;
    }

    const columns = Object.keys(rows[0]);
    const colNames = columns.map(c => `\`${c}\``).join(', ');

    dump += `-- Table: ${tableName}\n`;
    dump += `TRUNCATE TABLE \`${tableName}\`;\n`;

    for (const row of rows) {
      const values = columns.map(col => {
        const val = row[col];
        if (val === null || val === undefined) return 'NULL';
        if (typeof val === 'string') return `'${val.replace(/'/g, "\\'").replace(/\\/g, '\\\\')}'`;
        if (typeof val === 'boolean') return val ? '1' : '0';
        if (val instanceof Date) return `'${val.toISOString().slice(0, 19).replace('T', ' ')}'`;
        return typeof val === 'string' ? `'${val}'` : String(val);
      }).join(', ');

      dump += `INSERT INTO \`${tableName}\` (${colNames}) VALUES (${values});\n`;
    }
    dump += '\n';
    console.log(`Table ${tableName}: ${rows.length} lignes`);
  }

  dump += 'SET FOREIGN_KEY_CHECKS = 1;\n';

  const outputPath = path.join(__dirname, 'dump.sql');
  fs.writeFileSync(outputPath, dump, 'utf-8');
  console.log(`\nFichier créé: ${outputPath}`);
  console.log(`Import sur MySQL: mysql -u user -p ${process.env.DB_NAME || 'linguere_db'} < dump.sql`);

  await sqliteDb.close();
  process.exit(0);
}

migrate().catch(err => {
  console.error('Erreur de migration:', err);
  process.exit(1);
});