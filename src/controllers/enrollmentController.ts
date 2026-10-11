import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.js';
import prisma from '../config/database.js';

// Enroll a student in a course offering
export const enrollStudent = async (req: AuthRequest, res: Response) => {
  try {
    const { studentId, courseOfferingId } = req.body;

    if (!studentId || !courseOfferingId) {
      return res.status(400).json({ success: false, message: 'studentId and courseOfferingId are required.' });
    }

    const enrollment = await prisma.enrollment.create({
      data: {
        studentId: Number(studentId),
        courseOfferingId: Number(courseOfferingId),
      },
      include: {
        student: true,
        courseOffering: {
          include: { course: true, academicTerm: true }
        }
      }
    });

    return res.status(201).json({ success: true, message: 'Student successfully enrolled.', data: enrollment });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Server error or student already enrolled in this offering.', error: error.message });
  }
};

// Get all enrollments
export const getAllEnrollments = async (req: AuthRequest, res: Response) => {
  try {
    const enrollments = await prisma.enrollment.findMany({
      include: {
        student: true,
        courseOffering: {
          include: { course: true, academicTerm: true }
        },
        grade: true,
      },
    });
    return res.status(200).json({ success: true, data: enrollments });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};