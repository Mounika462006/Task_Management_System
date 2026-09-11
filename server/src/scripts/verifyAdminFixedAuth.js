require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const Task = require('../models/Task');
const { ensureAdminUser } = require('../services/adminService');

async function testAdminAuthentication() {
  console.log('===============================================================');
  console.log(' FIXED ADMIN AUTHENTICATION & RBAC VERIFICATION');
  console.log('===============================================================\n');

  console.log('1. Verifying Database Connection & Running ensureAdminUser()...');
  await mongoose.connect(process.env.MONGODB_URI);
  const syncedAdmin = await ensureAdminUser();
  console.log('   Admin in MongoDB:');
  console.log('   - ID:   ', syncedAdmin._id.toString());
  console.log('   - Email:', syncedAdmin.email);
  console.log('   - Name: ', syncedAdmin.name);
  console.log('   - Role: ', syncedAdmin.role);

  if (syncedAdmin.email !== (process.env.ADMIN_EMAIL || 'admin.taskflow@gmail.com').toLowerCase().trim()) {
    throw new Error(`Admin email mismatch! Expected ${process.env.ADMIN_EMAIL}, got ${syncedAdmin.email}`);
  }
  if (syncedAdmin.role !== 'ADMIN') {
    throw new Error(`Admin role mismatch! Expected ADMIN, got ${syncedAdmin.role}`);
  }

  // Check tasks linked to this admin
  const tasksCount = await Task.countDocuments({ createdBy: syncedAdmin._id });
  console.log(`   - Tasks linked to this admin document: ${tasksCount}`);

  const baseUrl = 'http://localhost:5000/api';
  const adminEmail = process.env.ADMIN_EMAIL || 'admin.taskflow@gmail.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456';

  console.log('\n2. Testing Admin Login with Wrong Password...');
  const wrongPwRes = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: adminEmail, password: 'WrongPassword123!', role: 'ADMIN' }),
  });
  const wrongPwData = await wrongPwRes.json();
  console.log(`   Status: ${wrongPwRes.status}, Message: "${wrongPwData.message}"`);
  if (wrongPwRes.status !== 401 || wrongPwData.message !== 'Invalid admin email or password.') {
    throw new Error('Test 2 Failed: Expected 401 "Invalid admin email or password."');
  }
  console.log('   Result: PASS. Rejection message matches requirement.');

  console.log('\n3. Testing Admin Login with Wrong Email...');
  const wrongEmailRes = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'unknown@gmail.com', password: adminPassword, role: 'ADMIN' }),
  });
  const wrongEmailData = await wrongEmailRes.json();
  console.log(`   Status: ${wrongEmailRes.status}, Message: "${wrongEmailData.message}"`);
  if (wrongEmailRes.status !== 401 || wrongEmailData.message !== 'Invalid admin email or password.') {
    throw new Error('Test 3 Failed: Expected 401 "Invalid admin email or password."');
  }
  console.log('   Result: PASS. Rejection message matches requirement.');

  console.log('\n4. Testing Employee credentials attempted on Admin Login...');
  const empOnAdminRes = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'john.doe@example.com', password: 'Employee@123456', role: 'ADMIN' }),
  });
  const empOnAdminData = await empOnAdminRes.json();
  console.log(`   Status: ${empOnAdminRes.status}, Message: "${empOnAdminData.message}"`);
  if (empOnAdminRes.status !== 401 || empOnAdminData.message !== 'Invalid admin email or password.') {
    throw new Error('Test 4 Failed: Expected 401 "Invalid admin email or password."');
  }
  console.log('   Result: PASS. Employee blocked from logging into Admin panel.');

  console.log('\n5. Testing Valid Fixed Admin Login...');
  console.log(`   Logging in with Email: ${adminEmail}`);
  const validAdminRes = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: adminEmail, password: adminPassword, role: 'ADMIN' }),
  });
  const validAdminData = await validAdminRes.json();
  console.log(`   Status: ${validAdminRes.status}, Success: ${validAdminData.success}, Role: ${validAdminData.user?.role}`);
  if (validAdminRes.status !== 200 || validAdminData.user?.role !== 'ADMIN' || !validAdminData.token) {
    throw new Error('Test 5 Failed: Valid Admin login failed!');
  }
  const adminToken = validAdminData.token;
  console.log('   Result: PASS. Authenticated successfully with role = ADMIN and JWT issued.');

  console.log('\n6. Testing Admin RBAC API Access with JWT Token...');
  const adminDashRes = await fetch(`${baseUrl}/dashboard/admin`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  const adminDashData = await adminDashRes.json();
  console.log(`   Admin Dashboard Status: ${adminDashRes.status}, Total Tasks: ${adminDashData.data?.totalTasks}`);
  if (adminDashRes.status !== 200) {
    throw new Error('Test 6 Failed: Admin dashboard metrics request failed');
  }
  console.log('   Result: PASS. Admin dashboard API accessible.');

  console.log('\n7. Testing Employee Login & Role Isolation...');
  const empLoginRes = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'john.doe@example.com', password: 'Employee@123456' }),
  });
  const empLoginData = await empLoginRes.json();
  console.log(`   Employee Login Status: ${empLoginRes.status}, Role: ${empLoginData.user?.role}`);
  if (empLoginRes.status !== 200 || empLoginData.user?.role !== 'EMPLOYEE') {
    throw new Error('Test 7 Failed: Employee login failed');
  }
  const empToken = empLoginData.token;

  // Verify employee cannot access Admin dashboard
  const empAdminDashRes = await fetch(`${baseUrl}/dashboard/admin`, {
    headers: { Authorization: `Bearer ${empToken}` },
  });
  console.log(`   Employee Access to /api/dashboard/admin Status: ${empAdminDashRes.status}`);
  if (empAdminDashRes.status !== 403) {
    throw new Error('Test 7 Failed: Employee was not rejected with 403 on Admin route');
  }
  console.log('   Result: PASS. Employee rejected with 403 from Admin routes.');

  console.log('\n===============================================================');
  console.log(' ALL 7 FIXED ADMIN AUTHENTICATION TESTS PASSED PERFECTLY!');
  console.log('===============================================================\n');

  await mongoose.disconnect();
  process.exit(0);
}

testAdminAuthentication().catch(async (err) => {
  console.error('\nTest Failed with Error:', err.message);
  try { await mongoose.disconnect(); } catch (e) {}
  process.exit(1);
});
