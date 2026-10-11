import { Router } from 'express';
import { enrollStudent, getAllEnrollments } from '../controllers/enrollmentController.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', authenticateToken, getAllEnrollments);
router.post('/', authenticateToken, authorizeRoles('ADMINISTRATOR', 'REGISTRAR', 'INSTRUCTOR'), enrollStudent);

export default router;