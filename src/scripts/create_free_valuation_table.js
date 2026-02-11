const pool = require('../db');

const query = `
CREATE TABLE IF NOT EXISTS company_free_valuation_models (
    id SERIAL PRIMARY KEY,
    
    -- OPTIONAL: Identifier if you are saving specific company runs
    company_name VARCHAR(255), 

    -- 1. INPUTS
    sector VARCHAR(100),                -- Industry/Sector
    country VARCHAR(100),               -- Country/Region
    annual_revenue BIGINT,              -- Annual Revenue
    ebit BIGINT,                        -- EBIT (Operating Profit)
    currency CHAR(3),                   -- Currency
    employees INT,                      -- Number of Employees (Optional)
    top3_customers_pct DECIMAL(5, 2),   -- Top 3 Customers % (Optional)

    -- 2. BACKEND CALCULATIONS
    calc_fx_rate_to_eur DECIMAL(10, 4), -- FX Rate to EUR
    calc_ebit_eur BIGINT,               -- EBIT (EUR)
    
    factor_base_ebit_multiple DECIMAL(5, 2),      -- Base EBIT Multiple
    factor_country_risk DECIMAL(5, 2),            -- Country Risk Factor
    factor_size_adj DECIMAL(5, 2),                -- Size Adjustment Factor
    factor_conc_adj DECIMAL(5, 2),                -- Customer Concentration Adjustment

    -- 3. VALUATION OUTPUT
    val_calc_adj_multiple DECIMAL(5, 2),          -- Calculated Adjusted Multiple
    
    -- Mid-Point
    val_ev_mid BIGINT,                            -- Enterprise Value (Mid-point)
    val_ev_mid_eur_k BIGINT,                      -- Enterprise Value (Mid-point) (000 EUR)

    -- Low Range (85%)
    val_ev_low BIGINT,                            -- Low (Calculated)
    val_ev_low_eur_k BIGINT,                      -- Low (Calculated) (000 EUR)

    -- High Range (115%)
    val_ev_high BIGINT,                           -- High (Calculated)
    val_ev_high_eur_k BIGINT,                     -- High (Calculated) (000 EUR)

    -- 4. SCORING & CHECKS
    risk_comment TEXT,                            -- Risk Comment
    plausibility_check VARCHAR(255),              -- Plausibility Check
    acquisition_score INT,                        -- Acquisition Score (0-100)

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

(async () => {
    try {
        console.log('Creating company_free_valuation_models table...');
        await pool.query(query);
        console.log('Table created successfully.');
    } catch (err) {
        console.error('Error creating table:', err);
    } finally {
        await pool.end();
    }
})();
