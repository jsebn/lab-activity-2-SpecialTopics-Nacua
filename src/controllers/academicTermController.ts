import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.js';
import prisma from '../config/database.js';

export const getAllTerms = async (req: AuthRequest, res: Response) => {
  try {
    const terms = await prisma.academicTerm.findMany();
    return res.status(200).json({ success: true, data: terms });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const createTerm = async (req: AuthRequest, res: Response) => {
  try {
    const { academicYear, semester, startDate, endDate } = req.body;
    if (!academicYear || !semester || !startDate || !endDate) {
      return res.status(400).json({ success: false, message: 'academicYear, semester, startDate, and endDate are required.' });
    }
    const term = await prisma.academicTerm.create({
      data: {
        academicYear,
        semester,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      }
    });
    return res.status(201).json({ success: true, message: 'Academic term created successfully.', data: term });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};