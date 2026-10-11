import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.js';
import prisma from '../config/database.js';

// Get all courses
export const getAllCourses = async (req: AuthRequest, res: Response) => {
  try {
    const courses = await prisma.course.findMany();
    return res.status(200).json({ success: true, data: courses });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Create a new course
export const createCourse = async (req: AuthRequest, res: Response) => {
  try {
    const { courseCode, courseTitle, description, units } = req.body;

    if (!courseCode || !courseTitle || units === undefined) {
      return res.status(400).json({ success: false, message: 'courseCode, courseTitle, and units are required.' });
    }

    const newCourse = await prisma.course.create({
      data: {
        courseCode,
        courseTitle,
        description,
        units: Number(units),
      },
    });

    return res.status(201).json({ success: true, message: 'Course created successfully.', data: newCourse });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Get all course offerings
export const getAllOfferings = async (req: AuthRequest, res: Response) => {
  try {
    const offerings = await prisma.courseOffering.findMany({
      include: { course: true, academicTerm: true, instructor: true },
    });
    return res.status(200).json({ success: true, data: offerings });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Create a course offering
export const createOffering = async (req: AuthRequest, res: Response) => {
  try {
    const { courseId, academicTermId, instructorId, section, schedule, room, capacity } = req.body;

    if (!courseId || !academicTermId || !instructorId || !section || !schedule || !room || !capacity) {
      return res.status(400).json({ success: false, message: 'All course offering fields are required.' });
    }

    const newOffering = await prisma.courseOffering.create({
      data: {
        courseId: Number(courseId),
        academicTermId: Number(academicTermId),
        instructorId: Number(instructorId),
        section,
        schedule,
        room,
        capacity: Number(capacity),
      },
      include: { course: true, academicTerm: true, instructor: true },
    });

    return res.status(201).json({ success: true, message: 'Course offering created successfully.', data: newOffering });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};