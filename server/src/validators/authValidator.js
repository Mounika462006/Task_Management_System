const { z } = require('zod');

const loginSchema = z
  .object({
    identifier: z.string().trim().optional(),
    email: z.string().trim().optional(),
    username: z.string().trim().optional(),
    password: z
      .string({ required_error: 'Password is required' })
      .min(1, 'Password cannot be empty'),
    role: z.enum(['ADMIN', 'EMPLOYEE']).optional(),
  })
  .refine((data) => Boolean(data.identifier || data.email || data.username), {
    message: 'Email or Username is required',
    path: ['identifier'],
  });

const createEmployeeSchema = z
  .object({
    name: z
      .string({ required_error: 'Full Name is required' })
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name cannot exceed 100 characters')
      .trim(),
    email: z
      .string({ required_error: 'Email is required' })
      .email('Invalid email address')
      .trim()
      .toLowerCase(),
    password: z
      .string({ required_error: 'Password is required' })
      .min(6, 'Password must be at least 6 characters')
      .max(100, 'Password cannot exceed 100 characters'),
    confirmPassword: z.string().optional(),
    employeeId: z.string().trim().optional(),
    username: z.string().trim().toLowerCase().optional(),
    phone: z.string().trim().optional(),
    department: z.string().trim().optional(),
    designation: z.string().trim().optional(),
    dateOfJoining: z.union([z.string(), z.date()]).optional(),
    status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']).optional(),
  })
  .refine(
    (data) => {
      if (data.confirmPassword) {
        return data.password === data.confirmPassword;
      }
      return true;
    },
    {
      message: 'Confirm password must match password',
      path: ['confirmPassword'],
    }
  );

const updateEmployeeSchema = z.object({
  name: z.string().min(2).max(100).trim().optional(),
  email: z.string().email('Invalid email address').trim().toLowerCase().optional(),
  password: z.string().min(6).max(100).optional(),
  employeeId: z.string().trim().optional(),
  username: z.string().trim().toLowerCase().optional(),
  phone: z.string().trim().optional(),
  department: z.string().trim().optional(),
  designation: z.string().trim().optional(),
  dateOfJoining: z.union([z.string(), z.date()]).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']).optional(),
});

const registerEmployeeSchema = z
  .object({
    name: z
      .string({ required_error: 'Full name is required' })
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name cannot exceed 100 characters')
      .trim(),
    email: z
      .string({ required_error: 'Email address is required' })
      .email('Please provide a valid email address')
      .trim()
      .toLowerCase(),
    password: z
      .string({ required_error: 'Password is required' })
      .min(6, 'Password must be at least 6 characters')
      .max(100, 'Password cannot exceed 100 characters'),
    confirmPassword: z
      .string({ required_error: 'Confirm Password is required' })
      .min(1, 'Confirm Password cannot be empty'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

const verifyOtpSchema = z.object({
  email: z
    .string({ required_error: 'Email address is required' })
    .email('Invalid email address')
    .trim()
    .toLowerCase(),
  otp: z
    .string({ required_error: 'OTP is required' })
    .regex(/^\d{6}$/, 'OTP must be exactly 6 digits'),
});

const resendOtpSchema = z.object({
  email: z
    .string({ required_error: 'Email address is required' })
    .email('Invalid email address')
    .trim()
    .toLowerCase(),
});

module.exports = {
  loginSchema,
  createEmployeeSchema,
  updateEmployeeSchema,
  registerEmployeeSchema,
  verifyOtpSchema,
  resendOtpSchema,
};
