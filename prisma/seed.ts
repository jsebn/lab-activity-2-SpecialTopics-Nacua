import { Role, Status } from '@prisma/client';
import bcrypt from 'bcrypt';
import prisma from '../src/config/database.js';

async function main() {
  console.log('Seeding exact required dataset quantities...');

  const hashedPassword = await bcrypt.hash('password123', 10);
  
  // 1. Users (Exactly 5)
  console.log('Seeding 5 Users...');
  const usersData = [
    { name: 'Admin User', email: 'admin@example.com', role: Role.ADMINISTRATOR },
    { name: 'Registrar Staff', email: 'registrar@example.com', role: Role.REGISTRAR },
    { name: 'Prof. Alan Turing', email: 'turing@example.com', role: Role.INSTRUCTOR },
    { name: 'Prof. Ada Lovelace', email: 'lovelace@example.com', role: Role.INSTRUCTOR },
    { name: 'Student Portal User', email: 'student_user@example.com', role: Role.STUDENT },
  ];

  for (const u of usersData) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: { name: u.name, email: u.email, passwordHash: hashedPassword, role: u.role },
    });
  }
  const instructors = await prisma.user.findMany({ where: { role: Role.INSTRUCTOR } });

  // 2. Programs (Exactly 3)
  console.log('Seeding 3 Programs...');
  const programsData = [
    { code: 'BSIT', name: 'Bachelor of Science in Information Technology', description: 'Software Development track' },
    { code: 'BSCS', name: 'Bachelor of Science in Computer Science', description: 'Core Computer Science track' },
    { code: 'BSIS', name: 'Bachelor of Science in Information Systems', description: 'Business Analytics track' },
  ];

  const createdPrograms = [];
  for (const p of programsData) {
    const prog = await prisma.program.upsert({
      where: { code: p.code },
      update: {},
      create: { code: p.code, name: p.name, description: p.description },
    });
    createdPrograms.push(prog);
  }

  // 3. Academic Terms (Exactly 2)
  console.log('Seeding 2 Academic Terms...');
  const termsData = [
    { id: 1, academicYear: '2026-2027', semester: '1st Semester', startDate: new Date('2026-08-01'), endDate: new Date('2026-12-20') },
    { id: 2, academicYear: '2026-2027', semester: '2nd Semester', startDate: new Date('2027-01-15'), endDate: new Date('2027-05-30') },
  ];

  const createdTerms = [];
  for (const t of termsData) {
    const term = await prisma.academicTerm.upsert({
      where: { id: t.id },
      update: {},
      create: { id: t.id, academicYear: t.academicYear, semester: t.semester, startDate: t.startDate, endDate: t.endDate },
    });
    createdTerms.push(term);
  }

  // 4. Courses (Exactly 20)
  console.log('Seeding 20 Courses...');
  const createdCourses = [];
  for (let i = 1; i <= 20; i++) {
    const code = `IT10${i < 10 ? '0' + i : i}`;
    const course = await prisma.course.upsert({
      where: { courseCode: code },
      update: {},
      create: {
        courseCode: code,
        courseTitle: `Information Technology Course ${i}`,
        description: `Description for course ${i}`,
        units: 3,
      },
    });
    createdCourses.push(course);
  }

  // 5. Course Offerings (Exactly 20)
  console.log('Seeding 20 Course Offerings...');
  const createdOfferings = [];
  for (let i = 0; i < 20; i++) {
    const course = createdCourses[i % createdCourses.length]!;
    const term = createdTerms[i % createdTerms.length]!;
    const instructor = instructors[i % instructors.length]!;

    const offering = await prisma.courseOffering.create({
      data: {
        courseId: course.id,
        academicTermId: term.id,
        instructorId: instructor.id,
        section: `SEC-${i + 1}`,
        schedule: 'MWF 9:00 AM - 10:30 AM',
        room: `Lab ${ (i % 5) + 1 }`,
        capacity: 40,
      },
    });
    createdOfferings.push(offering);
  }

  // 6. Students (Exactly 100)
  console.log('Seeding 100 Students...');
  const createdStudents = [];
  for (let i = 1; i <= 100; i++) {
    const studentNum = `2026-${String(i).padStart(5, '0')}`;
    const studentEmail = `student${i}@example.com`;
    const program = createdPrograms[(i - 1) % createdPrograms.length]!;

    const student = await prisma.student.upsert({
      where: { studentNumber: studentNum },
      update: {},
      create: {
        studentNumber: studentNum,
        firstName: `First${i}`,
        lastName: `Last${i}`,
        birthDate: new Date('2004-01-01'),
        email: studentEmail,
        programId: program.id,
        yearLevel: (i % 4) + 1,
      },
    });
    createdStudents.push(student);
  }

  // 7. Enrollments (Exactly 200 - distributing 2 offerings per student across the 100 students)
  console.log('Seeding 200 Enrollments...');
  const createdEnrollments = [];
  let offeringIndex = 0;
  for (const student of createdStudents) {
    // Enroll each student in 2 different course offerings
    for (let j = 0; j < 2; j++) {
      const offering = createdOfferings[offeringIndex % createdOfferings.length]!;
      offeringIndex++;

      // Check if enrollment already exists to prevent duplicate unique constraint errors on seed re-runs
      const existingEnrollment = await prisma.enrollment.findFirst({
        where: { studentId: student.id, courseOfferingId: offering.id },
      });

      if (existingEnrollment) {
        createdEnrollments.push(existingEnrollment);
      } else {
        const enrollment = await prisma.enrollment.create({
          data: {
            studentId: student.id,
            courseOfferingId: offering.id,
            status: Status.ACTIVE,
          },
        });
        createdEnrollments.push(enrollment);
      }
    }
  }

  // 8. Grades (Exactly 100 - mapping to the first 100 enrollments)
  console.log('Seeding 100 Grades...');
  for (let i = 0; i < 100 && i < createdEnrollments.length; i++) {
    const enrollment = createdEnrollments[i]!;

    await prisma.grade.upsert({
      where: { enrollmentId: enrollment.id },
      update: {},
      create: {
        enrollmentId: enrollment.id,
        midtermGrade: 1.5,
        finalGrade: 1.75,
        remarks: 'PASSED',
      },
    });
  }

  console.log('Successfully seeded exact quantities: 5 Users, 3 Programs, 100 Students, 20 Courses, 2 Terms, 20 Offerings, 200 Enrollments, 100 Grades!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });