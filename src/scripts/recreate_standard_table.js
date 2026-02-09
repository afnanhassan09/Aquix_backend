const { Client } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

async function recreateTable() {
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    try {
        await client.connect();
        console.log("Connected to database...");

        await client.query('DROP TABLE IF EXISTS company_standard_valuation_models CASCADE');
        console.log("Dropped table company_standard_valuation_models.");

        const query = `
        CREATE TABLE company_standard_valuation_models (
            id SERIAL PRIMARY KEY,

            -- 1. IDENTIFICATION
            company_name VARCHAR(255) NOT NULL,
            sector VARCHAR(100),
            country_code CHAR(2),
            currency_code CHAR(3),
            employees INT,

            -- 2. HISTORICAL FINANCIALS
            revenue_y1 BIGINT,
            revenue_y2 BIGINT,
            revenue_y3 BIGINT,
            ebit_y1 BIGINT,
            ebit_y2 BIGINT,
            ebit_y3 BIGINT,

            -- 3. FORECAST FINANCIALS
            revenue_f1 BIGINT,
            revenue_f2 BIGINT,
            revenue_f3 BIGINT,
            ebit_f1 BIGINT,
            ebit_f2 BIGINT,
            ebit_f3 BIGINT,

            -- 4. RISK & OPERATIONS INPUTS
            top3_concentration_pct DECIMAL(5, 2),
            founder_dependency_high BOOLEAN,
            supplier_dependency_high BOOLEAN,
            key_staff_retention_plan BOOLEAN,
            documentation_readiness VARCHAR(50),
            seller_flexibility VARCHAR(50),
            target_timeline_months INT,

            -- 5. BACKEND HELPERS & CALCULATED LOOKUPS
            calc_fx_rate DECIMAL(10, 4),
            calc_rev_avg_eur BIGINT,
            calc_ebit_avg_eur BIGINT,
            calc_ebit_margin_pct DECIMAL(10, 2),
            calc_ebit_cagr_pct DECIMAL(10, 2),
            calc_volatility_pct DECIMAL(10, 2),
            calc_rev_cagr_pct DECIMAL(10, 2),

            factor_base_multiple DECIMAL(5, 2),
            factor_country_risk DECIMAL(5, 2),
            factor_size_adj DECIMAL(5, 2),
            factor_conc_adj DECIMAL(5, 2),
            factor_adj_multiple DECIMAL(5, 2),

            val_ev_low_eur VARCHAR(50),
            val_ev_mid_eur VARCHAR(50),
            val_ev_high_eur VARCHAR(50),

            -- 6. SCORING & METRICS
            financial_strength INT,
            growth_score INT,
            risk_management INT,
            data_completeness INT,
            sector_context INT,
            investment_attractiveness INT,

            dealability_size_subscore INT,
            dealability_documentation_subscore INT,
            dealability_flexibility_subscore INT,
            dealability_timeline_subscore INT,
            dealability_score INT,

            risk_flags TEXT,
            tapway_score INT,

            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        `;

        await client.query(query);
        console.log("Table company_standard_valuation_models re-created successfully.");

    } catch (err) {
        console.error("Error recreating table:", err);
    } finally {
        await client.end();
    }
}

recreateTable();
