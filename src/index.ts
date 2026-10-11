import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import enrollmentRoutes from './routes/enrollmentRoutes.js';
import gradeRoutes from './routes/gradeRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import programRoutes from './routes/programRoutes.js';
import academicTermRoutes from './routes/academicTermRoutes.js';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/grades', gradeRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/programs', programRoutes);
app.use('/api/terms', academicTermRoutes);

// Health check endpoint
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: 'Student Information Management API is running.' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});