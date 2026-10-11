Laboratory Activity 2

A robust, TypeScript-powered backend RESTful API built for academic student information management, supporting multi-role authentication, complete domain module workflows, and automated database seeding.

Author: Nacua, Johann Sebastian  
Course: Special Topics in Software Development

--------------------------------------------------
TECH STACK & ENVIRONMENT
--------------------------------------------------
- Runtime: Node.js with TypeScript (tsx)
- Framework: Express.js
- Database & ORM: PostgreSQL & Prisma ORM
- Authentication: JSON Web Tokens (JWT) & bcrypt password hashing
- Testing Tool: Postman

--------------------------------------------------
INSTALLATION & SETUP GUIDE
--------------------------------------------------

1. Clone the Repository & Install Dependencies:
   git clone <repository-url>
   cd student-management-api
   npm install

2. Configure Environment Variables:
   Create a .env file in the root directory based on .env.example:
   DATABASE_URL="postgresql://postgres:root@127.0.0.1:5432/student_management_db?schema=public"
   PORT=8000

3. Database Migration & Seeding:
   Initialize the PostgreSQL database schema and populate the required dataset quantities (5 Users, 3 Programs, 100 Students, 20 Courses, 2 Academic Terms, 20 Course Offerings, 200 Enrollments, and 100 Grades):
   
   npx prisma migrate dev --name init
   npx prisma db seed

4. Running the Application:
   Start the development server with live reload:
   npm run dev
   
   The server will start and listen at http://127.0.0.1:8000.

--------------------------------------------------
AUTHENTICATION & TESTING INSTRUCTIONS
--------------------------------------------------
1. Login (Obtain Token): Send a POST request to http://127.0.0.1:8000/api/auth/login using seeded credentials (e.g., admin@example.com or registrar@example.com with password password123).
2. Authorize Requests: Copy the returned JWT token string from the response body and attach it as a Bearer Token under Postman's Authorization tab for all protected endpoints.
3. Inspect Database: Run npx prisma studio in a separate terminal tab to inspect live database records and real-time transaction updates.