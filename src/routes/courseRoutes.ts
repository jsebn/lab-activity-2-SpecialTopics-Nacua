import { Router } from 'express';
import { getAllCourses, createCourse, getAllOfferings, createOffering } from '../controllers/courseController.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', authenticateToken, getAllCourses);
router.post('/', authenticateToken, authorizeRoles('ADMINISTRATOR', 'REGISTRAR'), createCourse);

router.get('/offerings', authenticateToken, getAllOfferings);
router.post('/offerings', authenticateToken, authorizeRoles('ADMINISTRATOR', 'REGISTRAR'), createOffering);

export default router;