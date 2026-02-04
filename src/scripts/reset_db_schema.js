const fs = require('fs');
const path = require('path');
const { Client } = require('pg');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const SCHEMA_PATH = path.join(__dirname, '../db/schema.sql');

async function resetSchema() {
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    try {
        await client.connect();
        console.log("Connected to database...");

        // 1. Drop existing valuation & constant tables
        console.log("Dropping relevant tables...");
        const dropQuery = `
            DROP TABLE IF EXISTS company_valuation_models CASCADE;
            DROP TABLE IF EXISTS constant_sector_metrics CASCADE;
            DROP TABLE IF EXISTS constant_country_adjustments CASCADE;
            DROP TABLE IF EXISTS constant_size_adjustments CASCADE;
            DROP TABLE IF EXISTS constant_concentration_adjustments CASCADE;
            DROP TABLE IF EXISTS constant_fx_rates CASCADE;
            DROP TABLE IF EXISTS constant_deal_size_scores CASCADE;
            DROP TABLE IF EXISTS constant_credit_ratings CASCADE;
        `;
        await client.query(dropQuery);
        console.log("Tables dropped.");

        // 2. Read and Execute Schema
        console.log("Reading schema.sql...");
        const schemaSql = fs.readFileSync(SCHEMA_PATH, 'utf8');

        console.log("Re-creating schema...");
        await client.query(schemaSql);
        console.log("Schema applied successfully.");

    } catch (err) {
        console.error("Error resetting schema:", err);
    } finally {
        await client.end();
    }
}

resetSchema();
