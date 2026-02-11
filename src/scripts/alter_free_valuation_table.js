const pool = require('../db');

async function migrate() {
    try {
        console.log('Altering company_free_valuation_models table...');

        // Alter columns to VARCHAR(50)
        // We use creating a temporary column, copying data, or just casting if possible.
        // Since the current data causing error is invalid for BIGINT, likely the table is empty or has partial data.
        // If there's existing data that is BIGINT, casting to VARCHAR is safe.
        // If there's no data, it's also safe.

        await pool.query(`
            ALTER TABLE company_free_valuation_models 
            ALTER COLUMN val_ev_mid_eur_k TYPE VARCHAR(50),
            ALTER COLUMN val_ev_low_eur_k TYPE VARCHAR(50),
            ALTER COLUMN val_ev_high_eur_k TYPE VARCHAR(50);
        `);

        console.log('Table altered successfully.');
    } catch (err) {
        console.error('Error altering table:', err);
    } finally {
        await pool.end();
    }
}

migrate();
