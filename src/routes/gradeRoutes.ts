import { Router } from 'express';
import { upsertGrade, getGrades } from '../controllers/gradeController.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', authenticateToken, getGrades);
router.post('/', authenticateToken, authorizeRoles('ADMINISTRATOR', 'REGISTRAR', 'INSTRUCTOR'), upsertGrade);

export default router;