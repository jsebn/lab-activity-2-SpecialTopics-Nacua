import { Router } from 'express';
import { getAllPrograms, createProgram } from '../controllers/programController.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = Router();
router.get('/', authenticateToken, getAllPrograms);
router.post('/', authenticateToken, authorizeRoles('ADMINISTRATOR', 'REGISTRAR'), createProgram);
export default router;