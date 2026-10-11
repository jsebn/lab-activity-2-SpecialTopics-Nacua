import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.js';
import prisma from '../config/database.js';

export const getAllPrograms = async (req: AuthRequest, res: Response) => {
  try {
    const programs = await prisma.program.findMany({ include: { students: true } });
    return res.status(200).json({ success: true, data: programs });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

export const createProgram = async (req: AuthRequest, res: Response) => {
  try {
    const { code, name, description } = req.body;
    if (!code || !name) {
      return res.status(400).json({ success: false, message: 'code and name are required.' });
    }
    const program = await prisma.program.create({
      data: { code, name, description }
    });
    return res.status(201).json({ success: true, message: 'Program created successfully.', data: program });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};