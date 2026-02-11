# Valuation API Documentation

This document describes the API endpoints for the three types of valuations: **Free**, **Standard**, and **Enterprise**.

## 1. Free Valuations

These routes handle the "Free Version" valuations, which require minimal inputs.

### 1.1 Create Free Valuation
**Endpoint:** `POST /api/free-valuations`

**Description:** Creates a new free valuation model and returns the calculated metrics.

**Request Body (JSON):**
```json
{
  "company_name": "Example Company",
  "sector": "Technology",
  "country": "US",
  "annual_revenue": 1000000,
  "ebit": 200000,
  "currency": "USD",
  "employees": 10,
  "top3_customers_pct": 15
}
```

**Response (JSON):**
Returns the created record, including all calculated fields.
```json
{
    "id": 1,
    "company_name": "Example Company",
    "sector": "Technology",
    "country": "US",
    "annual_revenue": "1000000",
    "ebit": "200000",
    "currency": "USD",
    "employees": 10,
    "top3_customers_pct": "15.00",
    "calc_fx_rate_to_eur": "0.9200",
    "calc_ebit_eur": "184000",
    "factor_base_ebit_multiple": "6.50",
    "factor_country_risk": "0.00",
    "factor_size_adj": "-1.50",
    "factor_conc_adj": "0.00",
    "val_calc_adj_multiple": "5.00",
    "val_ev_mid": "920000",
    "val_ev_mid_eur_k": "920k EUR",
    "val_ev_low": "782000",
    "val_ev_low_eur_k": "782k EUR",
    "val_ev_high": "1058000",
    "val_ev_high_eur_k": "1,058k EUR",
    "risk_comment": "No major concentration risk",
    "plausibility_check": "PASS",
    "acquisition_score": 75,
    "created_at": "2024-01-01T12:00:00.000Z"
}
```

### 1.2 Get Free Valuation
**Endpoint:** `GET /api/free-valuations/:companyName`

**Description:** Retrieves a specific free valuation by company name.

**Response:** Same JSON structure as the POST response.

---

## 2. Standard Valuations

These routes handle the "Standard Version" valuations, which require historical financial data and basic operational inputs.

### 2.1 Create Standard Valuation
**Endpoint:** `POST /api/standard-valuations`

**Description:** Creates a new standard valuation model.

**Request Body (JSON):**
```json
{
  "company_name": "Standard Corp",
  "sector": "SaaS",
  "country_code": "DE",
  "currency_code": "EUR",
  "employees": 50,
  "revenue_y1": 5000000,
  "revenue_y2": 6000000,
  "revenue_y3": 7500000,
  "ebit_y1": 1000000,
  "ebit_y2": 1200000,
  "ebit_y3": 1800000,
  "revenue_f1": 9000000,
  "revenue_f2": 11000000,
  "revenue_f3": 14000000,
  "ebit_f1": 2200000,
  "ebit_f2": 3000000,
  "ebit_f3": 4000000,
  "top3_concentration_pct": 20,
  "founder_dependency_high": false,
  "supplier_dependency_high": false,
  "key_staff_retention_plan": true,
  "documentation_readiness": "Partial",
  "seller_flexibility": "Medium",
  "target_timeline_months": 6
}
```

**Response (JSON):**
Returns the created record with calculated fields.
```json
{
    "id": 5,
    "company_name": "Standard Corp",
    ...
    "calc_rev_avg_eur": "6166667",
    "calc_ebit_avg_eur": "1333333",
    "factor_base_multiple": "10.00",
    "factor_adj_multiple": "9.50",
    "val_ev_mid_eur": "15000000",
    "dealability_score": 75,
    ...
}
```

### 2.2 Get Standard Valuation
**Endpoint:** `GET /api/standard-valuations/:companyName`

**Description:** Retrieves a specific standard valuation by company name.

**Response:** Same JSON structure as the POST response.

---

## 3. Enterprise Valuations

These routes handle the "Enterprise Version" valuations, which require comprehensive financial data, balance sheet items, and detailed risk inputs.

### 3.1 Create Enterprise Valuation
**Endpoint:** `POST /api/enterprise-valuations`

**Description:** Creates a new enterprise valuation model. Returns a structured object with `input` and `calculated_metrics` nested objects.

**Request Body (JSON):**
```json
{
  "company_name": "Enterprise Ltd",
  "sector": "Manufacturing",
  "country_code": "UK",
  "currency_code": "GBP",
  "valuation_date": "2024-02-10",
  "employees": 500,
  
  // Historical Financials
  "revenue_y1": 50000000, "revenue_y2": 52000000, "revenue_y3": 55000000,
  "ebit_y1": 5000000, "ebit_y2": 5500000, "ebit_y3": 6000000,
  
  // Forecast Financials
  "revenue_f1": 58000000, "revenue_f2": 61000000, "revenue_f3": 65000000,
  "ebit_f1": 6500000, "ebit_f2": 7000000, "ebit_f3": 7500000,

  // Balance Sheet / Health
  "total_debt": 10000000,
  "current_assets": 15000000,
  "current_liabilities": 8000000,
  "credit_rating": "BBB",
  "ownership_pct": 100,
  "mgmt_turnover_pct": 5,
  "litigation_active": false,

  // Risk / Operations
  "top3_concentration_pct": 10,
  "founder_dependency_high": false,
  "supplier_dependency_high": false,
  "key_staff_retention_plan": true,
  "financials_audited": true,
  "documentation_readiness": "Full",
  "seller_flexibility": "High",
  "target_timeline_months": 12
}
```

**Response (JSON):**
Note: The response format for Enterprise is nested.
```json
{
    "input": {
        "company_name": "Enterprise Ltd",
        ...
    },
    "calculated_metrics": {
        "calc_fx_rate": 1.17,
        "calc_rev_avg_eur": 61230000,
        "factor_adj_multiple": 8.5,
        "val_ev_mid_eur": 55000000,
        "tapway_institutional_score": 88,
        ...
    }
}
```

### 3.2 Get Enterprise Valuation
**Endpoint:** `GET /api/enterprise-valuations/:companyName`

**Description:** Retrieves a specific enterprise valuation by company name.

**Response:** Returns the raw database record (flat structure), unlike the POST response which nests it.
```json
{
    "id": 10,
    "company_name": "Enterprise Ltd",
    "val_ev_mid_eur": "55000000",
    ...
}
```
