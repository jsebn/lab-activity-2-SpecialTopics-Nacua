import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.js';
import prisma from '../config/database.js';

// Upsert or record grades for an enrollment
export const upsertGrade = async (req: AuthRequest, res: Response) => {
  try {
    const { enrollmentId, midtermGrade, finalGrade, remarks } = req.body;

    if (!enrollmentId) {
      return res.status(400).json({ success: false, message: 'enrollmentId is required.' });
    }

    // Build update data dynamically to respect exactOptionalPropertyTypes
    const updateData: any = {};
    if (midtermGrade !== undefined) updateData.midtermGrade = Number(midtermGrade);
    if (finalGrade !== undefined) updateData.finalGrade = Number(finalGrade);
    if (remarks !== undefined) updateData.remarks = remarks;

    const grade = await prisma.grade.upsert({
      where: { enrollmentId: Number(enrollmentId) },
      update: updateData,
      create: {
        enrollmentId: Number(enrollmentId),
        midtermGrade: midtermGrade !== undefined ? Number(midtermGrade) : null,
        finalGrade: finalGrade !== undefined ? Number(finalGrade) : null,
        remarks: remarks !== undefined ? remarks : null,
      },
      include: {
        enrollment: {
          include: { student: true, courseOffering: { include: { course: true } } }
        }
      }
    });

    return res.status(200).json({ success: true, message: 'Grade recorded successfully.', data: grade });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Get grades
export const getGrades = async (req: AuthRequest, res: Response) => {
  try {
    const grades = await prisma.grade.findMany({
      include: {
        enrollment: {
          include: { student: true, courseOffering: { include: { course: true } } }
        }
      }
    });
    return res.status(200).json({ success: true, data: grades });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};