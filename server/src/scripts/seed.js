const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const Task = require('../models/Task');

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/task_management';
    
    // Mask password so it is never exposed in console logs
    const sanitizedUri = mongoUri.replace(/:\/\/([^:]+):([^@]+)@/, '://$1:****@');
    console.log(`[Seed] Connecting to MongoDB: ${sanitizedUri}`);

    // Set 10-second connection timeout to prevent indefinite hanging
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });

    console.log('[Seed] Ensuring indexes...');
    await User.syncIndexes();
    await Task.syncIndexes();

    console.log('[Seed] Clearing existing collections (users, tasks)...');
    await Task.deleteMany({});
    await User.deleteMany({});

    console.log('[Seed] Creating Admin and Employee accounts...');

    // 1 Admin
    const admin = await User.create({
      name: 'Sarah Connor (Admin)',
      email: 'admin@example.com',
      password: 'Admin@123456',
      role: 'ADMIN',
    });

    // 3 Employees
    const employee1 = await User.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'Employee@123456',
      role: 'EMPLOYEE',
    });

    const employee2 = await User.create({
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      password: 'Employee@123456',
      role: 'EMPLOYEE',
    });

    const employee3 = await User.create({
      name: 'Alex Kim',
      email: 'alex.kim@example.com',
      password: 'Employee@123456',
      role: 'EMPLOYEE',
    });

    console.log('[Seed] Creating sample tasks...');
    const tasks = [
      {
        title: 'Design Authentication & Role UI',
        description: 'Create responsive login and role-based dashboard wireframes with Figma and test responsive breakpoints.',
        assignedTo: employee1._id,
        status: 'COMPLETED',
        priority: 'HIGH',
        createdBy: admin._id,
      },
      {
        title: 'Implement MongoDB Indexing for Search',
        description: 'Ensure title text indexes and composite indexes on assignedTo and status are configured and optimized.',
        assignedTo: employee1._id,
        status: 'IN_PROGRESS',
        priority: 'URGENT',
        createdBy: admin._id,
      },
      {
        title: 'Audit API Rate Limiting & Helmet Headers',
        description: 'Verify security headers with Helmet and check brute-force protection thresholds on the login endpoint.',
        assignedTo: employee1._id,
        status: 'NOT_STARTED',
        priority: 'MEDIUM',
        createdBy: admin._id,
      },
      {
        title: 'Setup Nodemailer Email Dispatch Notifications',
        description: 'Configure SMTP credentials and verify fire-and-log non-blocking email dispatch logic for status updates.',
        assignedTo: employee2._id,
        status: 'COMPLETED',
        priority: 'HIGH',
        createdBy: admin._id,
      },
      {
        title: 'Draft End-to-End API Documentation',
        description: 'Document all REST endpoints, query parameters for search/pagination, and standard 422 error structures.',
        assignedTo: employee2._id,
        status: 'IN_PROGRESS',
        priority: 'MEDIUM',
        createdBy: admin._id,
      },
      {
        title: 'Implement Pagination Controls with Previous/Next',
        description: 'Connect server pagination metadata (total, totalPages, limit) with the UI pagination component.',
        assignedTo: employee2._id,
        status: 'NOT_STARTED',
        priority: 'LOW',
        createdBy: admin._id,
      },
      {
        title: 'Perform Security Vulnerability Scan',
        description: 'Review dependencies for known vulnerabilities, verify CORS policies with credentials, and check JWT secret strength.',
        assignedTo: employee3._id,
        status: 'IN_PROGRESS',
        priority: 'URGENT',
        createdBy: admin._id,
      },
      {
        title: 'Employee Workload Dashboard Analytics',
        description: 'Build aggregation queries calculating total tasks, completed, in progress, and not started for each employee.',
        assignedTo: employee3._id,
        status: 'NOT_STARTED',
        priority: 'HIGH',
        createdBy: admin._id,
      },
      {
        title: 'Optimize Database Query Execution Times',
        description: 'Analyze explain plans for task searches by title and employee name regex to ensure sub-50ms latency.',
        assignedTo: employee3._id,
        status: 'COMPLETED',
        priority: 'LOW',
        createdBy: admin._id,
      },
      {
        title: 'Refactor Error Handling Middleware',
        description: 'Standardize 400, 401, 403, 404, 409, 422, and 500 error responses and verify no stack traces leak in production.',
        assignedTo: employee1._id,
        status: 'IN_PROGRESS',
        priority: 'MEDIUM',
        createdBy: admin._id,
      },
    ];

    await Task.insertMany(tasks);

    console.log('\n======================================================');
    console.log(' DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('======================================================');
    console.log('Ready-to-use reviewer test accounts:');
    console.log('------------------------------------------------------');
    console.log(' 👑 ADMIN Account:');
    console.log('    Email:    admin@example.com');
    console.log('    Password: Admin@123456');
    console.log('    Role:     ADMIN');
    console.log('------------------------------------------------------');
    console.log(' 👷 EMPLOYEE 1:');
    console.log('    Email:    john.doe@example.com');
    console.log('    Password: Employee@123456');
    console.log('    Role:     EMPLOYEE');
    console.log('------------------------------------------------------');
    console.log(' 👷 EMPLOYEE 2:');
    console.log('    Email:    jane.smith@example.com');
    console.log('    Password: Employee@123456');
    console.log('    Role:     EMPLOYEE');
    console.log('------------------------------------------------------');
    console.log(' 👷 EMPLOYEE 3:');
    console.log('    Email:    alex.kim@example.com');
    console.log('    Password: Employee@123456');
    console.log('    Role:     EMPLOYEE');
    console.log('======================================================\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('\n[Seed Error] Database seeding failed:');
    if (error.name === 'MongooseServerSelectionError') {
      console.error('>> Could not connect to MongoDB Atlas cluster.');
      console.error('>> Root Cause: IP address is not allowed in MongoDB Atlas Network Access.');
      console.error('>> Solution: Go to MongoDB Atlas -> Network Access -> Add IP Address -> Add "0.0.0.0/0" (Allow from anywhere) or whitelist your current public IP.');
    } else {
      console.error(`>> ${error.message}`);
    }
    process.exit(1);
  }
};

seedDatabase();
