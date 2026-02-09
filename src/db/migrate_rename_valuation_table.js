const { Client } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

async function runMigration() {
    if (!process.env.DATABASE_URL) {
        console.error("Error: DATABASE_URL is not set.");
        process.exit(1);
    }

    const client = new Client({ connectionString: process.env.DATABASE_URL });

    try {
        await client.connect();
        console.log("Connected to database. Renaming company_valuation_models table...");

        const query = `
            ALTER TABLE IF EXISTS company_valuation_models 
            RENAME TO company_enterprise_valuation_models;
        `;

        await client.query(query);
        console.log("Table renamed successfully to company_enterprise_valuation_models.");

    } catch (err) {
        console.error("Migration failed:", err);
    } finally {
        await client.end();
    }
}

runMigration();
