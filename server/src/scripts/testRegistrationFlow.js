const app = require('../app');
const mongoose = require('mongoose');
const User = require('../models/User');
const PendingRegistration = require('../models/PendingRegistration');

async function runTests() {
  console.log('=== STARTING REGISTRATION & AUTH FLOW VERIFICATION ===\n');

  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/task_management';
  await mongoose.connect(mongoUri);

  const server = app.listen(5098);
  const baseUrl = 'http://localhost:5098/api';

  try {
    // -------------------------------------------------------------
    // TEST 1: Admin login & Admin Dashboard Access
    // -------------------------------------------------------------
    console.log('--- TEST 1: Admin Login & Dashboard Access ---');
    let res = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@example.com', password: 'Admin@123456' }),
    });
    let data = await res.json();
    console.log('Admin login status:', res.status, 'Role:', data.user?.role);
    if (res.status !== 200 || data.user?.role !== 'ADMIN') {
      throw new Error('Admin login failed');
    }

    const adminToken = data.token;
    res = await fetch(`${baseUrl}/dashboard/admin`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    data = await res.json();
    console.log('Admin dashboard access status:', res.status, 'Total tasks:', data.data?.totalTasks);
    if (res.status !== 200) throw new Error('Admin dashboard access failed');

    // -------------------------------------------------------------
    // TEST 5: Existing Email Rejection
    // -------------------------------------------------------------
    console.log('\n--- TEST 5: Existing Email Rejection ---');
    res = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Imposter Admin',
        email: 'admin@example.com', // Already exists!
        password: 'Password123',
        confirmPassword: 'Password123',
      }),
    });
    data = await res.json();
    console.log('Existing email registration status:', res.status, 'Message:', data.message);
    if (res.status !== 409) throw new Error('Expected 409 for duplicate email');

    // -------------------------------------------------------------
    // TEST 6: Password Mismatch Validation
    // -------------------------------------------------------------
    console.log('\n--- TEST 6: Password Mismatch Validation ---');
    res = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'New Employee',
        email: 'employee.test@example.com',
        password: 'Password123',
        confirmPassword: 'PasswordDifferent456',
      }),
    });
    data = await res.json();
    console.log('Password mismatch status:', res.status, 'Errors:', data.errors);
    if (res.status !== 422 || !data.errors?.some((e) => e.field === 'confirmPassword')) {
      throw new Error('Expected 422 for password mismatch');
    }

    // -------------------------------------------------------------
    // TEST 2: Valid Employee Sign Up Step 1 (Send OTP)
    // -------------------------------------------------------------
    console.log('\n--- TEST 2: Valid Employee Sign Up Step 1 (Send OTP) ---');
    const testEmail = 'david.miller@example.com';
    // Clean up test email if exists
    await User.deleteOne({ email: testEmail });
    await PendingRegistration.deleteOne({ email: testEmail });

    res = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'David Miller',
        email: testEmail,
        password: 'SecurePass@123',
        confirmPassword: 'SecurePass@123',
      }),
    });
    data = await res.json();
    console.log('Register step 1 status:', res.status, 'Message:', data.message);
    if (res.status !== 200) throw new Error('Register step 1 failed');

    // Verify PendingRegistration was created in DB
    const pending = await PendingRegistration.findOne({ email: testEmail });
    console.log('Pending registration found in DB:', Boolean(pending), 'Has otpHash:', Boolean(pending?.otpHash));
    if (!pending || !pending.otpHash) throw new Error('Pending registration record not created properly');

    // -------------------------------------------------------------
    // TEST 3: Wrong OTP Rejection
    // -------------------------------------------------------------
    console.log('\n--- TEST 3: Wrong OTP Rejection ---');
    res = await fetch(`${baseUrl}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        otp: '000000', // incorrect OTP
      }),
    });
    data = await res.json();
    console.log('Wrong OTP status:', res.status, 'Message:', data.message);
    if (res.status !== 400 || !data.message.includes('Invalid OTP')) {
      throw new Error('Expected 400 Invalid OTP');
    }

    // -------------------------------------------------------------
    // TEST 4: Expired OTP Rejection
    // -------------------------------------------------------------
    console.log('\n--- TEST 4: Expired OTP Rejection ---');
    const expiredEmail = 'expired.test@example.com';
    await PendingRegistration.create({
      name: 'Expired User',
      email: expiredEmail,
      password: 'hashedpassword',
      otpHash: 'somehash',
      expiresAt: new Date(Date.now() - 10000), // in the past
    });
    res = await fetch(`${baseUrl}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: expiredEmail,
        otp: '123456',
      }),
    });
    data = await res.json();
    console.log('Expired OTP status:', res.status, 'Message:', data.message);
    if (res.status !== 400 || !data.message.includes('expired')) {
      throw new Error('Expected 400 Expired OTP');
    }
    await PendingRegistration.deleteOne({ email: expiredEmail });

    // -------------------------------------------------------------
    // TEST 2 (Continued): Verify with Matching OTP & Login
    // -------------------------------------------------------------
    console.log('\n--- TEST 2 (Continued): Verify with Valid OTP & Complete Registration ---');
    // For test simulation, let's create a known OTP for David Miller
    const knownOtp = '987654';
    const { hashOtp } = require('../auth/otpHelper');
    pending.otpHash = hashOtp(knownOtp);
    await pending.save();

    res = await fetch(`${baseUrl}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        otp: knownOtp,
      }),
    });
    data = await res.json();
    console.log('OTP Verification status:', res.status, 'Message:', data.message, 'User role:', data.user?.role);
    if (res.status !== 201 || data.user?.role !== 'EMPLOYEE') {
      throw new Error('Expected 201 with role EMPLOYEE');
    }

    // Verify user in MongoDB
    const createdUser = await User.findOne({ email: testEmail });
    console.log('User created in MongoDB:', createdUser?.name, 'Role:', createdUser?.role, 'EmailVerified:', createdUser?.emailVerified);
    if (!createdUser || createdUser.role !== 'EMPLOYEE' || !createdUser.emailVerified) {
      throw new Error('User record invalid in DB');
    }

    // Now log in as David Miller
    console.log('\n--- Logging in with newly registered Employee account ---');
    res = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, password: 'SecurePass@123' }),
    });
    data = await res.json();
    console.log('Employee login status:', res.status, 'User:', data.user?.name);
    if (res.status !== 200) throw new Error('Employee login failed');
    const employeeToken = data.token;

    // -------------------------------------------------------------
    // TEST 7: Employee Cannot Access Admin Dashboard (RBAC)
    // -------------------------------------------------------------
    console.log('\n--- TEST 7: Employee Cannot Access Admin Dashboard (RBAC) ---');
    res = await fetch(`${baseUrl}/dashboard/admin`, {
      headers: { Authorization: `Bearer ${employeeToken}` },
    });
    data = await res.json();
    console.log('Employee accessing admin dashboard status:', res.status, 'Message:', data.message);
    if (res.status !== 403) throw new Error('Expected 403 Forbidden for Employee accessing Admin dashboard');

    // Clean up test user
    await User.deleteOne({ email: testEmail });

    console.log('\n=============================================================');
    console.log(' ALL REGISTRATION & OTP AUTHENTICATION TESTS PASSED 100%! ');
    console.log('=============================================================\n');
  } catch (err) {
    console.error('\n❌ Test failed:', err);
    process.exit(1);
  } finally {
    server.close();
    await mongoose.disconnect();
    process.exit(0);
  }
}

runTests();
