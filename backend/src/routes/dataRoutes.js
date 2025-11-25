import express from 'express';
import { getCompanyRoleData, getCompaniesRoles } from '../controllers/dataController.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();

// Public route to fetch available companies and roles for signup
router.get('/roles', getCompaniesRoles);

// Protected route used by dashboards
router.get('/:company/:role', protect, getCompanyRoleData);

export default router;