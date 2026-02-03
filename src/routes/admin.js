const express = require('express');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/authorize');
const { getUserManagement, getInvestors, deleteUser } = require('../controllers/adminController');

const router = express.Router();

// All admin routes require authentication and admin/superadmin role
router.use(authenticate);
router.use(requireRole(['admin', 'superadmin']));

/**
 * GET /api/admin/user-management
 * Get all investors and sellers with their profiles
 */
router.get('/user-management', getUserManagement);

/**
 * GET /api/admin/investors
 * Get all investors with unverified profiles (investorProfile and/or institutionalProfile)
 * Returns only investors whose profiles are NOT verified (is_verified = false)
 */
router.get('/investors', getInvestors);

/**
 * DELETE /api/admin/user
 * Delete a user (investor, seller, or admin) and all linked data
 * Body: { userId: UUID, userType: 'investor' | 'seller' | 'admin' }
 * This will delete:
 * - User record
 * - User roles
 * - OTPs
 * - Company profiles (for sellers)
 * - Investor profiles (for investors)
 * - Institutional profiles (for investors)
 */
router.delete('/user', deleteUser);

module.exports = router;

