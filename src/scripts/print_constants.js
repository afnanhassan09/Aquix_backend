const { Client } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

async function printConstants() {
    const client = new Client({ connectionString: process.env.DATABASE_URL });

    try {
        await client.connect();
        console.log("Connected to database...\n");

        const tables = [
            'constant_sector_metrics',
            'constant_country_adjustments',
            'constant_size_adjustments',
            'constant_concentration_adjustments',
            'constant_fx_rates',
            'constant_deal_size_scores',
            'constant_credit_ratings'
        ];

        for (const table of tables) {
            console.log(`\n=== TABLE: ${table} ===`);
            const res = await client.query(`SELECT * FROM ${table} LIMIT 100`);
            if (res.rows.length === 0) {
                console.log("  (Empty)");
            } else {
                console.table(res.rows);
            }
        }

    } catch (err) {
        console.error("Error executing query:", err);
    } finally {
        await client.end();
    }
}

printConstants();
