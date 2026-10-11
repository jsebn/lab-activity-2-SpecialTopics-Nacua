import { Router } from 'express';
import { getAllStudents, getStudentById, createStudent } from '../controllers/studentController.js';
import { authenticateToken, authorizeRoles } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', authenticateToken, getAllStudents);
router.get('/:id', authenticateToken, getStudentById);
router.post('/', authenticateToken, authorizeRoles('ADMIN', 'INSTRUCTOR'), createStudent);

export default router;
