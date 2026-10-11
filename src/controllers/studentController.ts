import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.js';
import prisma from '../config/database.js';

// Get all students
export const getAllStudents = async (req: AuthRequest, res: Response) => {
  try {
    const students = await prisma.student.findMany({
      include: { program: true },
    });
    return res.status(200).json({ success: true, data: students });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Get student by ID
export const getStudentById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const student = await prisma.student.findUnique({
      where: { id: Number(id) },
      include: { program: true, enrollments: true },
    });

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found.' });
    }

    return res.status(200).json({ success: true, data: student });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Create a new student record
export const createStudent = async (req: AuthRequest, res: Response) => {
  try {
    const { studentNumber, firstName, lastName, email, birthDate, programId, yearLevel } = req.body;

    if (!studentNumber || !firstName || !lastName || !email || !birthDate || !programId || !yearLevel) {
      return res.status(400).json({ success: false, message: 'All required student fields (studentNumber, firstName, lastName, email, birthDate, programId, yearLevel) must be provided.' });
    }

    const newStudent = await prisma.student.create({
      data: {
        studentNumber,
        firstName,
        lastName,
        email,
        birthDate: new Date(birthDate),
        programId: Number(programId),
        yearLevel: Number(yearLevel),
      },
    });

    return res.status(201).json({ success: true, message: 'Student created successfully.', data: newStudent });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};