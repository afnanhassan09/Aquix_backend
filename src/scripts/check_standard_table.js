const { Client } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

async function checkTable() {
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    try {
        await client.connect();
        const res = await client.query(`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'company_standard_valuation_models';
        `);
        console.log("Columns found:");
        res.rows.forEach(r => console.log(r.column_name));
    } catch (err) {
        console.error("Error checking table:", err);
    } finally {
        await client.end();
    }
}

checkTable();
