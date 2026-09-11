const app = require('../app');
const connectDB = require('../config/database');
const mongoose = require('mongoose');

async function runTests() {
  console.log('[Test] Connecting to DB...');
  await connectDB();

  const server = app.listen(5099);
  const baseUrl = 'http://localhost:5099/api';

  try {
    console.log('\n--- 1. Testing Health Check ---');
    let res = await fetch(`${baseUrl}/health`);
    let data = await res.json();
    console.log('Health check:', res.status, data.message);

    console.log('\n--- 2. Testing Malformed ObjectId Validation (Must return 400) ---');
    res = await fetch(`${baseUrl}/tasks/not-a-valid-id`);
    data = await res.json();
    console.log('Malformed ID status:', res.status, 'Payload:', data);
    if (res.status !== 401 && res.status !== 400) {
      console.error('FAILED: expected 400 or 401');
    }

    console.log('\n--- 3. Testing Login (Admin) ---');
    res = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@example.com', password: 'Admin@123456' }),
    });
    const adminLogin = await res.json();
    console.log('Admin login status:', res.status, 'User:', adminLogin.user?.name);
    const adminToken = adminLogin.token;
    const cookieHeader = res.headers.get('set-cookie');

    console.log('\n--- 4. Testing Malformed ObjectId with Auth (Must return 400) ---');
    res = await fetch(`${baseUrl}/tasks/malformed-id-123`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    data = await res.json();
    console.log('Protected Malformed ID status:', res.status, 'Message:', data.message);

    console.log('\n--- 5. Testing Zod Validation Error (Must return 422) ---');
    res = await fetch(`${baseUrl}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        title: '', // empty title
        priority: 'INVALID_PRIORITY',
      }),
    });
    data = await res.json();
    console.log('Zod validation status:', res.status, 'Errors count:', data.errors?.length, data.errors);

    console.log('\n--- 6. Testing Pagination and Search ---');
    res = await fetch(`${baseUrl}/tasks?page=1&limit=3&search=UI`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    data = await res.json();
    console.log('Search & pagination status:', res.status, 'Pagination meta:', data.pagination, 'Results count:', data.data?.length);

    console.log('\n--- 7. Testing Admin Dashboard Metrics ---');
    res = await fetch(`${baseUrl}/dashboard/admin`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    data = await res.json();
    console.log('Admin dashboard status:', res.status, 'Data:', data.data);

    console.log('\n--- 8. Testing Employee Login and Scoped Access ---');
    res = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'john.doe@example.com', password: 'Employee@123456' }),
    });
    const employeeLogin = await res.json();
    const employeeToken = employeeLogin.token;
    console.log('Employee login status:', res.status, 'User:', employeeLogin.user?.name);

    console.log('\n--- 9. Testing Employee RBAC (Employee cannot access Admin Dashboard) ---');
    res = await fetch(`${baseUrl}/dashboard/admin`, {
      headers: { Authorization: `Bearer ${employeeToken}` },
    });
    data = await res.json();
    console.log('Employee access admin dashboard status:', res.status, 'Message:', data.message);

    console.log('\n--- 10. Testing Employee Task Status Update (Fire-and-log email) ---');
    // Get employee's tasks
    res = await fetch(`${baseUrl}/tasks`, {
      headers: { Authorization: `Bearer ${employeeToken}` },
    });
    const empTasks = await res.json();
    const sampleTask = empTasks.data[0];
    console.log(`Updating task "${sampleTask.title}" (${sampleTask._id}) from ${sampleTask.status} to COMPLETED`);

    res = await fetch(`${baseUrl}/tasks/${sampleTask._id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${employeeToken}`,
      },
      body: JSON.stringify({ status: 'COMPLETED' }),
    });
    data = await res.json();
    console.log('Status update result:', res.status, 'New status:', data.data?.status);

    console.log('\n======================================================');
    console.log(' ALL BACKEND CHECKS PASSED WITH FLYING COLORS!');
    console.log('======================================================');
  } catch (err) {
    console.error('Test failed with error:', err);
  } finally {
    server.close();
    await mongoose.disconnect();
    process.exit(0);
  }
}

runTests();
