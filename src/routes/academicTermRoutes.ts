import { Router } from 'express';
import { getAllTerms, createTerm } from '../controllers/academicTermController.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = Router();
router.get('/', authenticateToken, getAllTerms);
router.post('/', authenticateToken, authorizeRoles('ADMINISTRATOR', 'REGISTRAR'), createTerm);
export default router;