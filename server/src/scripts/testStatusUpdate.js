const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const http = require('http');
const { signToken } = require('../auth/betterAuth');

const token = signToken({
  _id: '6aa383860eb45c18b0cde6ad',
  id: '6aa383860eb45c18b0cde6ad',
  email: 'mounikanagarajan04@gmail.com',
  role: 'EMPLOYEE',
});

console.log('Sending PATCH request to update task status...');

const data = JSON.stringify({ status: 'IN_PROGRESS' });

const options = {
  hostname: '127.0.0.1',
  port: 5000,
  path: '/api/tasks/6aa392b376518b78c23f1bdb/status',
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data),
    'Authorization': `Bearer ${token}`,
  },
};

const req = http.request(options, (res) => {
  console.log(`Response Status Code: ${res.statusCode}`);
  console.log(`Response Headers:`, res.headers);
  let body = '';
  res.on('data', (chunk) => { body += chunk; });
  res.on('end', () => {
    console.log('Response Body:', body);
    process.exit(0);
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
  console.error(e);
  process.exit(1);
});

req.write(data);
req.end();
