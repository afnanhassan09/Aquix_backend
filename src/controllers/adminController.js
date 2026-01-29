const pool = require('../db');

/**
 * Get all investors and sellers with their profiles
 * Includes users without profiles and inactive users (OTP not verified)
 * Combines user data with profile data into single objects
 */
const getUserManagement = async (req, res) => {
  try {
    // Fetch all users with investor role (including inactive and without profiles)
    const investorsUsersResult = await pool.query(
      `SELECT DISTINCT
        u.id as user_id,
        u.full_name as user_full_name,
        u.email as user_email,
        u.company as user_company,
        u.is_active as user_is_active,
        u.created_at as user_created_at,
        u.updated_at as user_updated_at
      FROM users u
      JOIN user_roles ur ON u.id = ur.user_id
      JOIN roles r ON ur.role_id = r.id
      WHERE r.name = 'investor'
      ORDER BY u.created_at DESC`
    );

    // Fetch all users with seller role (including inactive and without profiles)
    const sellersUsersResult = await pool.query(
      `SELECT DISTINCT
        u.id as user_id,
        u.full_name as user_full_name,
        u.email as user_email,
        u.company as user_company,
        u.is_active as user_is_active,
        u.created_at as user_created_at,
        u.updated_at as user_updated_at
      FROM users u
      JOIN user_roles ur ON u.id = ur.user_id
      JOIN roles r ON ur.role_id = r.id
      WHERE r.name = 'seller'
      ORDER BY u.created_at DESC`
    );

    // Fetch all investor_profiles
    const investorsProfilesResult = await pool.query(
      `SELECT * FROM investor_profiles ORDER BY created_at DESC`
    );

    // Fetch all institutional_profiles
    const institutionalProfilesResult = await pool.query(
      `SELECT * FROM institutional_profiles ORDER BY created_at DESC`
    );

    // Fetch all company_profiles
    const sellersProfilesResult = await pool.query(
      `SELECT * FROM company_profiles ORDER BY created_at DESC`
    );

    // Create maps to store profiles by user_id
    const investorProfilesMap = new Map();
    const institutionalProfilesMap = new Map();
    const companyProfilesMap = new Map();

    // Map investor_profiles by user_id
    investorsProfilesResult.rows.forEach(profile => {
      investorProfilesMap.set(profile.user_id, {
        id: profile.id,
        userId: profile.user_id,
        fullName: profile.full_name,
        firmSize: profile.firm_size,
        primaryMarkets: profile.primary_markets,
        investmentFocus: profile.investment_focus,
        contactNumber: profile.contact_number,
        isVerified: profile.is_verified,
        verifiedBy: profile.verified_by,
        verifiedAt: profile.verified_at,
        createdAt: profile.created_at,
        updatedAt: profile.updated_at
      });
    });

    // Map institutional_profiles by user_id
    institutionalProfilesResult.rows.forEach(profile => {
      institutionalProfilesMap.set(profile.user_id, {
        id: profile.id,
        userId: profile.user_id,
        fullName: profile.full_name,
        companyWebsite: profile.company_website,
        businessEmail: profile.business_email,
        countryOfRegistration: profile.country_of_registration,
        companyFundName: profile.company_fund_name,
        officeLocationCity: profile.office_location_city,
        typeOfInstitution: profile.type_of_institution,
        targetCompanySize: profile.target_company_size,
        assetsUnderManagement: profile.assets_under_management,
        preferredRegions: profile.preferred_regions,
        typicalDealTicketSize: profile.typical_deal_ticket_size,
        dealStagePreference: profile.deal_stage_preference,
        sectorsOfInterest: profile.sectors_of_interest,
        fundDocumentUrl: profile.fund_document_url,
        websiteReference: profile.website_reference,
        additionalMessage: profile.additional_message,
        ndaConsent: profile.nda_consent,
        isVerified: profile.is_verified,
        verifiedBy: profile.verified_by,
        verifiedAt: profile.verified_at,
        createdAt: profile.created_at,
        updatedAt: profile.updated_at
      });
    });

    // Map company_profiles by user_id
    sellersProfilesResult.rows.forEach(profile => {
      companyProfilesMap.set(profile.user_id, {
        id: profile.id,
        userId: profile.user_id,
        fullName: profile.full_name,
        position: profile.position,
        founderManagingDirector: profile.founder_managing_director,
        businessEmail: profile.business_email,
        companyName: profile.company_name,
        country: profile.country,
        phone: profile.phone,
        city: profile.city,
        yearFounded: profile.year_founded,
        legalForm: profile.legal_form,
        industrySector: profile.industry_sector,
        numberOfEmployees: profile.number_of_employees,
        annualRevenue: profile.annual_revenue,
        ebit: profile.ebit,
        currentYearEstimate: profile.current_year_estimate,
        currency: profile.currency,
        customerConcentrationPercent: profile.customer_concentration_percent,
        growthTrend: profile.growth_trend,
        ownershipStructure: profile.ownership_structure,
        founderSharesPercent: profile.founder_shares_percent,
        successionPlanned: profile.succession_planned,
        currentAdvisors: profile.current_advisors,
        interestedInSale: profile.interested_in_sale,
        dataUploadUrl: profile.data_upload_url,
        ndaConsent: profile.nda_consent,
        gdprConsent: profile.gdpr_consent,
        isVerified: profile.is_verified,
        verifiedBy: profile.verified_by,
        verifiedAt: profile.verified_at,
        createdAt: profile.created_at,
        updatedAt: profile.updated_at
      });
    });

    // Combine investors with their profiles
    const investors = investorsUsersResult.rows.map(row => {
      return {
        user: {
          id: row.user_id,
          fullName: row.user_full_name,
          email: row.user_email,
          company: row.user_company,
          isActive: row.user_is_active,
          profileImageUrl: null, // Optional field - column doesn't exist yet
          createdAt: row.user_created_at,
          updatedAt: row.user_updated_at
        },
        investorProfile: investorProfilesMap.get(row.user_id) || null,
        institutionalProfile: institutionalProfilesMap.get(row.user_id) || null
      };
    });

    // Combine sellers with their profiles
    const sellers = sellersUsersResult.rows.map(row => {
      return {
        user: {
          id: row.user_id,
          fullName: row.user_full_name,
          email: row.user_email,
          company: row.user_company,
          isActive: row.user_is_active,
          profileImageUrl: null, // Optional field - column doesn't exist yet
          createdAt: row.user_created_at,
          updatedAt: row.user_updated_at
        },
        companyProfile: companyProfilesMap.get(row.user_id) || null
      };
    });

    res.json({
      success: true,
      data: {
        investors,
        sellers
      },
      counts: {
        investors: investors.length,
        sellers: sellers.length,
        total: investors.length + sellers.length
      }
    });
  } catch (error) {
    console.error('User management error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Get all investors with unverified profiles (investorProfile and/or institutionalProfile)
 * Returns only investors whose profiles are NOT verified (is_verified = false)
 */
const getInvestors = async (req, res) => {
  try {
    // Fetch investors who have unverified investor_profiles
    const investorsResult = await pool.query(
      `SELECT 
        ip.*,
        u.id as user_id,
        u.full_name as user_full_name,
        u.email as user_email,
        u.company as user_company,
        u.is_active as user_is_active,
        u.created_at as user_created_at,
        u.updated_at as user_updated_at
      FROM investor_profiles ip
      JOIN users u ON ip.user_id = u.id
      WHERE ip.is_verified = false
      ORDER BY ip.created_at DESC`
    );

    // Fetch investors who have unverified institutional_profiles
    const institutionalInvestorsResult = await pool.query(
      `SELECT 
        inst.*,
        u.id as user_id,
        u.full_name as user_full_name,
        u.email as user_email,
        u.company as user_company,
        u.is_active as user_is_active,
        u.created_at as user_created_at,
        u.updated_at as user_updated_at
      FROM institutional_profiles inst
      JOIN users u ON inst.user_id = u.id
      WHERE inst.is_verified = false
      ORDER BY inst.created_at DESC`
    );

    // Create a map to combine investors with their profiles
    const investorsMap = new Map();

    // Process investor_profiles (only unverified)
    investorsResult.rows.forEach(row => {
      const userId = row.user_id;
      
      if (!investorsMap.has(userId)) {
        investorsMap.set(userId, {
          user: {
            id: row.user_id,
            fullName: row.user_full_name,
            email: row.user_email,
            company: row.user_company,
            isActive: row.user_is_active,
            profileImageUrl: null, // Optional field - column doesn't exist yet
            createdAt: row.user_created_at,
            updatedAt: row.user_updated_at
          },
          investorProfile: null,
          institutionalProfile: null
        });
      }

      investorsMap.get(userId).investorProfile = {
        id: row.id,
        userId: row.user_id,
        fullName: row.full_name,
        firmSize: row.firm_size,
        primaryMarkets: row.primary_markets,
        investmentFocus: row.investment_focus,
        contactNumber: row.contact_number,
        isVerified: row.is_verified,
        verifiedBy: row.verified_by,
        verifiedAt: row.verified_at,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      };
    });

    // Process institutional_profiles (only unverified) and merge with existing investors
    institutionalInvestorsResult.rows.forEach(row => {
      const userId = row.user_id;
      
      if (!investorsMap.has(userId)) {
        investorsMap.set(userId, {
          user: {
            id: row.user_id,
            fullName: row.user_full_name,
            email: row.user_email,
            company: row.user_company,
            isActive: row.user_is_active,
            profileImageUrl: null, // Optional field - column doesn't exist yet
            createdAt: row.user_created_at,
            updatedAt: row.user_updated_at
          },
          investorProfile: null,
          institutionalProfile: null
        });
      }

      investorsMap.get(userId).institutionalProfile = {
        id: row.id,
        userId: row.user_id,
        fullName: row.full_name,
        companyWebsite: row.company_website,
        businessEmail: row.business_email,
        countryOfRegistration: row.country_of_registration,
        companyFundName: row.company_fund_name,
        officeLocationCity: row.office_location_city,
        typeOfInstitution: row.type_of_institution,
        targetCompanySize: row.target_company_size,
        assetsUnderManagement: row.assets_under_management,
        preferredRegions: row.preferred_regions,
        typicalDealTicketSize: row.typical_deal_ticket_size,
        dealStagePreference: row.deal_stage_preference,
        sectorsOfInterest: row.sectors_of_interest,
        fundDocumentUrl: row.fund_document_url,
        websiteReference: row.website_reference,
        additionalMessage: row.additional_message,
        ndaConsent: row.nda_consent,
        isVerified: row.is_verified,
        verifiedBy: row.verified_by,
        verifiedAt: row.verified_at,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      };
    });

    // Convert map to array - only include investors who have at least one unverified profile
    const investors = Array.from(investorsMap.values());

    res.json({
      success: true,
      data: {
        investors
      },
      count: investors.length
    });
  } catch (error) {
    console.error('Get investors error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getUserManagement,
  getInvestors
};

